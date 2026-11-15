//! Pure-Rust Axum HTTP backend exposing a typed OpenAPI `/api/hello` endpoint.
//!
//! Business logic and validation live in `product-services`, delegated through
//! `product-adapter-axum`; this binary owns HTTP routing, OpenAPI export, and
//! process lifecycle only.

use axum::{Json, Router, extract::Query, http::StatusCode, routing::get};
use product_adapter_axum::AxumAdapter;
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, OpenApi, ToSchema};

/// Query parameters for `GET /api/hello`.
#[derive(Debug, Deserialize, IntoParams)]
pub struct HelloQuery {
    /// Optional recipient name (defaults to `"World"`).
    pub name: Option<String>,
}

/// Typed JSON response returned by `GET /api/hello`.
#[derive(Debug, Serialize, ToSchema)]
pub struct HelloResponse {
    pub message: String,
    pub platform: &'static str,
    pub version: &'static str,
}

/// Typed JSON error payload returned on validation or availability failures.
#[derive(Debug, Serialize, ToSchema)]
pub struct ErrorResponse {
    pub code: &'static str,
    pub message: String,
}

/// Return a typed Hello World greeting via the transport-independent service.
#[utoipa::path(
    get,
    path = "/api/hello",
    params(HelloQuery),
    responses(
        (status = 200, description = "Typed greeting payload", body = HelloResponse),
        (status = 400, description = "Invalid input", body = ErrorResponse)
    ),
    tag = "hello"
)]
async fn hello(
    Query(query): Query<HelloQuery>,
) -> Result<Json<HelloResponse>, (StatusCode, Json<ErrorResponse>)> {
    let adapter = AxumAdapter::new();
    match adapter.hello(query.name) {
        Ok(res) => Ok(Json(HelloResponse {
            message: res.message,
            platform: res.platform,
            version: res.version,
        })),
        Err(err) => {
            let status = StatusCode::from_u16(AxumAdapter::http_status_code(&err))
                .unwrap_or(StatusCode::INTERNAL_SERVER_ERROR);
            Err((
                status,
                Json(ErrorResponse {
                    code: err.code(),
                    message: err.to_string(),
                }),
            ))
        }
    }
}

/// OpenAPI document consumed by `@hey-api/openapi-ts` and `apps/docs` (`fumadocs-openapi`).
#[derive(OpenApi)]
#[openapi(
    info(
        title = "Product API",
        version = "0.1.0",
        description = "Typed Axum HTTP API shared across desktop, mobile, and extension clients."
    ),
    paths(hello),
    components(schemas(HelloResponse, ErrorResponse)),
    tags((name = "hello", description = "Starter health & greeting endpoints"))
)]
pub struct ApiDoc;

pub fn app_router() -> Router {
    Router::new()
        .route("/api/hello", get(hello))
        .route("/api/openapi.json", get(|| async { Json(ApiDoc::openapi()) }))
}

// This binary is an app composition root: it reads process configuration and, in the
// explicit OpenAPI-export mode, writes the generated spec to stdout for tooling to consume.
#[allow(
    clippy::disallowed_macros,
    clippy::disallowed_methods,
    clippy::print_stdout
)]
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    if std::env::args().any(|arg| arg == "--emit-openapi") {
        let spec = ApiDoc::openapi().to_pretty_json()?;
        println!("{spec}");
        return Ok(());
    }

    let addr = std::env::var("BIND_ADDR").unwrap_or_else(|_| "0.0.0.0:8080".to_string());
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    axum::serve(listener, app_router()).await?;
    Ok(())
}
