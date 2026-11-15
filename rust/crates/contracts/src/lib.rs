//! Transport-independent service contracts (DTOs, request/response envelopes, and errors).
//!
//! This crate has **zero workspace dependencies**: clients, adapters, and
//! transports can compile and test against these contracts ahead of any
//! runtime or service implementation.

use std::error::Error;
use std::fmt;

/// Crate version synchronized with the workspace manifest.
pub const VERSION: &str = env!("CARGO_PKG_VERSION");

/// Input payload for the transport-independent greeting operation.
#[derive(Debug, Clone, PartialEq, Eq, Default)]
pub struct GreetingRequest {
    /// Optional recipient name; defaults to `"World"` when omitted or blank.
    pub name: Option<String>,
}

/// Output payload returned by the greeting operation across every transport.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct GreetingResponse {
    /// Formatted greeting message.
    pub message: String,
    /// Platform/runtime identifier of the executing adapter.
    pub platform: &'static str,
    /// Product version string.
    pub version: &'static str,
}

/// Transport-independent service failure taxonomy.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ServiceError {
    /// Caller supplied malformed or out-of-policy input.
    InvalidInput {
        /// Name of the offending field.
        field: &'static str,
        /// Human-readable validation reason.
        reason: String,
    },
    /// The underlying capability or runtime is unavailable.
    Unavailable {
        /// Human-readable availability reason.
        reason: String,
    },
}

impl ServiceError {
    /// Stable `snake_case` error code shared across HTTP, IPC, and WASM boundaries.
    #[must_use]
    pub const fn code(&self) -> &'static str {
        match self {
            Self::InvalidInput { .. } => "invalid_input",
            Self::Unavailable { .. } => "unavailable",
        }
    }
}

impl fmt::Display for ServiceError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::InvalidInput { field, reason } => {
                write!(f, "invalid input for '{field}': {reason}")
            }
            Self::Unavailable { reason } => write!(f, "service unavailable: {reason}"),
        }
    }
}

impl Error for ServiceError {}

/// Single-door transport-independent request envelope.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ServiceRequest {
    /// Produce a validated greeting payload.
    Hello(GreetingRequest),
}

/// Single-door transport-independent response envelope.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ServiceResponse {
    /// Successful greeting payload.
    Hello(GreetingResponse),
    /// Structured domain/service failure.
    Error(ServiceError),
}
