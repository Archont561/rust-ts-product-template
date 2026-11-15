# `rust/crates/domain`

Pure Rust domain core containing the canonical entities, value objects, invariants, domain events, and typed domain errors shared across Server (Axum), Desktop/Mobile (Tauri), and Web/Extension (WASM).

## What Belongs Here

- Domain entities and strongly typed IDs / value objects (making invalid states unrepresentable).
- Pure business rules, validation logic, and state transitions.
- Deterministic domain calculations and domain event types.
- Typed error enums (`thiserror`) with clear operational semantics.

## What Does NOT Belong Here

- Database drivers (`sqlx`, `rusqlite`), filesystem calls, clocks/RNG without injected traits, or network I/O.
- HTTP status codes, Axum extractors, Tauri commands, or `wasm-bindgen` attributes.
- Serialization formats coupled to one transport (keep transport DTOs in `rust/crates/contracts`).

## Constraints & Dependencies

- **WASM-clean:** Must compile cleanly for `wasm32-unknown-unknown` as well as all native desktop/mobile/server targets listed in `rust/deny.toml`.
- **Zero workspace dependencies** (root of the Rust crate DAG).
- Minimal external crates (`serde`, `thiserror`, etc., audited via `cargo deny`).

## Testing

- Fast pure unit tests and property-based tests run under `cargo nextest` (`tasknest run rust test`) and measured in `coverage/rust/lcov.info`.
