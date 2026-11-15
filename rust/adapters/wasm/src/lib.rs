//! WebAssembly transport adapter for browsers and MV3 extensions.
//!
//! Runs the exact same [`ProductServices`] validation and logic linked
//! natively by `apps/web`, `apps/desktop`, and `apps/mobile`.

use product_contracts::{
    GreetingRequest, GreetingResponse, ServiceError, ServiceRequest, ServiceResponse,
};
use product_services::ProductServices;

/// Crate version synchronized with the workspace manifest.
pub const VERSION: &str = env!("CARGO_PKG_VERSION");

/// Platform tag reported when executing via WebAssembly.
pub const PLATFORM: &str = "wasm";

/// Thin WASM adapter wrapping [`ProductServices`].
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct WasmAdapter {
    services: ProductServices,
}

impl Default for WasmAdapter {
    fn default() -> Self {
        Self::new()
    }
}

impl WasmAdapter {
    /// Construct a WASM adapter targeting the `wasm` platform.
    #[must_use]
    pub const fn new() -> Self {
        Self {
            services: ProductServices::new(PLATFORM),
        }
    }

    /// Delegate greeting execution to the shared service.
    pub fn hello(&self, name: Option<String>) -> Result<GreetingResponse, ServiceError> {
        self.services.greet(GreetingRequest { name })
    }

    /// Delegate single-door request dispatch to the shared service.
    #[must_use]
    pub fn dispatch(&self, request: ServiceRequest) -> ServiceResponse {
        self.services.dispatch(request)
    }
}
