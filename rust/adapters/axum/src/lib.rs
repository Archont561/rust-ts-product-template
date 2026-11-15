//! Axum HTTP/WebSocket transport adapter and OpenAPI spec assembly.
//!
//! Translates HTTP query/path/body shapes into calls against
//! [`product_services::ProductServices`] and maps [`ServiceError`] values to
//! HTTP status codes without owning domain rules.

use product_contracts::{
    GreetingRequest, GreetingResponse, ServiceError, ServiceRequest, ServiceResponse,
};
use product_services::ProductServices;

/// Crate version synchronized with the workspace manifest.
pub const VERSION: &str = env!("CARGO_PKG_VERSION");

/// Default platform tag reported by the Axum web API server.
pub const PLATFORM: &str = "web-axum";

/// Thin Axum adapter wrapping transport-independent [`ProductServices`].
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AxumAdapter {
    services: ProductServices,
}

impl Default for AxumAdapter {
    fn default() -> Self {
        Self::new()
    }
}

impl AxumAdapter {
    /// Construct an Axum adapter targeting the `web-axum` platform.
    #[must_use]
    pub const fn new() -> Self {
        Self {
            services: ProductServices::new(PLATFORM),
        }
    }

    /// Construct an Axum adapter wrapping an injected [`ProductServices`] instance.
    #[must_use]
    pub const fn with_services(services: ProductServices) -> Self {
        Self { services }
    }

    /// Delegate `GET /api/hello` to the shared greeting service.
    pub fn hello(&self, name: Option<String>) -> Result<GreetingResponse, ServiceError> {
        self.services.greet(GreetingRequest { name })
    }

    /// Delegate a single-door [`ServiceRequest`] to the shared dispatcher.
    #[must_use]
    pub fn dispatch(&self, request: ServiceRequest) -> ServiceResponse {
        self.services.dispatch(request)
    }

    /// Map a transport-independent [`ServiceError`] to its HTTP status code.
    #[must_use]
    pub const fn http_status_code(error: &ServiceError) -> u16 {
        match error {
            ServiceError::InvalidInput { .. } => 400,
            ServiceError::Unavailable { .. } => 503,
        }
    }
}
