# `rust/crates/services`

Transport-independent product services and single-door request dispatcher shared across **Axum** (`apps/web`), **Tauri** (`apps/desktop`, `apps/mobile`), and **WASM** (`apps/extension`).

## Responsibilities

- Implements product use-cases and input validation once against `product-contracts` and `product-domain`.
- Exposes `ProductServices::dispatch(ServiceRequest) -> ServiceResponse` so every transport adapter executes identical business logic without duplicating handlers.

## Must Not Contain

- HTTP frameworks (`axum`), IPC bridges (`tauri`), WASM bindings (`wasm-bindgen`), or direct environment/OS I/O (`std::env::var`, raw sockets).
