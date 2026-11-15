//! Transport-independent product services and single-door dispatcher.
//!
//! Axum HTTP handlers, Tauri desktop/mobile commands, and WASM browser
//! entrypoints all delegate here so business rules and validation are
//! implemented once and cannot drift across runtimes.

use product_contracts::{
    GreetingRequest, GreetingResponse, ServiceError, ServiceRequest, ServiceResponse,
};

/// Crate version synchronized with the workspace manifest.
pub const VERSION: &str = env!("CARGO_PKG_VERSION");

/// Maximum allowed length (in Unicode scalar values) for a greeting recipient name.
pub const MAX_NAME_LEN: usize = 64;

/// Transport-independent application service container and dispatcher.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ProductServices {
    platform: &'static str,
}

impl ProductServices {
    /// Construct a service instance tagged with the executing runtime platform.
    #[must_use]
    pub const fn new(platform: &'static str) -> Self {
        Self { platform }
    }

    /// Return the platform identifier configured for this service instance.
    #[must_use]
    pub const fn platform(&self) -> &'static str {
        self.platform
    }

    /// Validate input and format a deterministic greeting response.
    pub fn greet(&self, request: GreetingRequest) -> Result<GreetingResponse, ServiceError> {
        let target = match request.name {
            Some(raw) => {
                let trimmed = raw.trim();
                if trimmed.is_empty() {
                    "World".to_string()
                } else {
                    if trimmed.chars().count() > MAX_NAME_LEN {
                        return Err(ServiceError::InvalidInput {
                            field: "name",
                            reason: format!("must be at most {MAX_NAME_LEN} characters"),
                        });
                    }
                    if trimmed.chars().any(char::is_control) {
                        return Err(ServiceError::InvalidInput {
                            field: "name",
                            reason: "must not contain control characters".to_string(),
                        });
                    }
                    trimmed.to_string()
                }
            }
            None => "World".to_string(),
        };

        Ok(GreetingResponse {
            message: format!("Hello, {target}!"),
            platform: self.platform,
            version: product_domain::VERSION,
        })
    }

    /// Execute any transport-independent [`ServiceRequest`] through one door.
    #[must_use]
    pub fn dispatch(&self, request: ServiceRequest) -> ServiceResponse {
        match request {
            ServiceRequest::Hello(greeting) => match self.greet(greeting) {
                Ok(response) => ServiceResponse::Hello(response),
                Err(error) => ServiceResponse::Error(error),
            },
        }
    }
}
