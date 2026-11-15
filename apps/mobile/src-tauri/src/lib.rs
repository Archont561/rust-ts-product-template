//! Thin Tauri v2 mobile shell delegating all operations to `product-adapter-tauri`
//! while registering mobile-only plugins (haptics, biometric, barcode scanner, SQLite).

use product_adapter_tauri::TauriBridge;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
#[serde(tag = "method", rename_all = "snake_case")]
pub enum RpcRequest {
    Hello { name: Option<String> },
}

#[derive(Debug, Serialize)]
pub struct HelloResponse {
    pub message: String,
    pub platform: &'static str,
    pub version: &'static str,
    pub plugins: Vec<&'static str>,
}

#[derive(Debug, Serialize)]
pub struct RpcErrorPayload {
    pub code: &'static str,
    pub message: String,
}

#[derive(Debug, Serialize)]
#[serde(tag = "status", rename_all = "snake_case")]
pub enum RpcResponse {
    Ok { data: HelloResponse },
    Err { error: RpcErrorPayload },
}

const MOBILE_PLUGINS: &[&str] = &[
    "deep-link",
    "notification",
    "sql",
    "barcode-scanner",
    "biometric",
    "haptics",
];

/// Single-door Tauri command forwarding protocol traffic into `product-services`.
#[tauri::command]
fn rpc(bridge: tauri::State<'_, TauriBridge>, request: RpcRequest) -> RpcResponse {
    match request {
        RpcRequest::Hello { name } => match bridge.hello(name) {
            Ok(res) => RpcResponse::Ok {
                data: HelloResponse {
                    message: res.message,
                    platform: res.platform,
                    version: res.version,
                    plugins: MOBILE_PLUGINS.to_vec(),
                },
            },
            Err(err) => RpcResponse::Err {
                error: RpcErrorPayload {
                    code: err.code(),
                    message: err.to_string(),
                },
            },
        },
    }
}

/// Convenience command retained for direct invocation.
#[tauri::command]
fn hello(
    bridge: tauri::State<'_, TauriBridge>,
    name: Option<String>,
) -> Result<HelloResponse, String> {
    bridge
        .hello(name)
        .map(|res| HelloResponse {
            message: res.message,
            platform: res.platform,
            version: res.version,
            plugins: MOBILE_PLUGINS.to_vec(),
        })
        .map_err(|err| err.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default()
        .manage(TauriBridge::mobile())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_sql::Builder::default().build());

    #[cfg(mobile)]
    let builder = builder
        .plugin(tauri_plugin_barcode_scanner::init())
        .plugin(tauri_plugin_biometric::init())
        .plugin(tauri_plugin_haptics::init());

    builder
        .invoke_handler(tauri::generate_handler![rpc, hello])
        .run(tauri::generate_context!())
        .expect("error while running Tauri mobile application");
}
