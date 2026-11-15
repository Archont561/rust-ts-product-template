//! Shared Tauri v2 IPC adapter used by both `apps/desktop` and `apps/mobile`.
//!
//! Centralizes transport-independent command delegation so desktop and mobile
//! shells differ only in native plugins and lifecycle hooks.

use product_contracts::{
    GreetingRequest, GreetingResponse, ServiceError, ServiceRequest, ServiceResponse,
};
use product_services::ProductServices;

/// Crate version synchronized with the workspace manifest.
pub const VERSION: &str = env!("CARGO_PKG_VERSION");

/// Platform tag for Tauri desktop builds.
pub const DESKTOP_PLATFORM: &str = "desktop-tauri";

/// Platform tag for Tauri mobile builds.
pub const MOBILE_PLATFORM: &str = "mobile-tauri";

/// Shared Tauri bridge backed by [`ProductServices`].
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct TauriBridge {
    services: ProductServices,
}

impl TauriBridge {
    /// Construct a bridge for `apps/desktop`.
    #[must_use]
    pub const fn desktop() -> Self {
        Self {
            services: ProductServices::new(DESKTOP_PLATFORM),
        }
    }

    /// Construct a bridge for `apps/mobile`.
    #[must_use]
    pub const fn mobile() -> Self {
        Self {
            services: ProductServices::new(MOBILE_PLATFORM),
        }
    }

    /// Construct a bridge around an injected [`ProductServices`] instance.
    #[must_use]
    pub const fn with_services(services: ProductServices) -> Self {
        Self { services }
    }

    /// Delegate the Tauri `hello` command to the shared service.
    pub fn hello(&self, name: Option<String>) -> Result<GreetingResponse, ServiceError> {
        self.services.greet(GreetingRequest { name })
    }

    /// Delegate the single-door Tauri `rpc` command to the shared dispatcher.
    #[must_use]
    pub fn dispatch(&self, request: ServiceRequest) -> ServiceResponse {
        self.services.dispatch(request)
    }
}
