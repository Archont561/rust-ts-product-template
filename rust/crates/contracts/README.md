# `rust/crates/contracts`

Shared Rust transport DTOs, request/response envelopes, event payloads, and schema export definitions that form the typed boundary between Rust backends and TypeScript frontends.

## What Belongs Here

- Request, response, pagination, and error DTOs crossing HTTP, Tauri IPC, or WASM boundaries.
- Schema annotations for code generation:
  - `utoipa::ToSchema` for Axum OpenAPI generation (`@hey-api/openapi-ts` consumes the spec).
  - `ts_rs::TS` / `specta::Type` for Tauri IPC and WASM TypeScript bindings.
- Explicit schema versioning and `#[serde(deny_unknown_fields)]` on strict wire records.

## What Does NOT Belong Here

- Business rules or repository logic (keep those in `rust/crates/domain`, `storage`, and `sync`).
- Axum routing/middleware or `#[tauri::command]` wrappers (keep those in `rust/adapters/*`).
- Internal persistence schemas (SQLite/Postgres row structs belong in `rust/crates/storage`).

## Architectural Boundary

Distinguish **transport contracts** (here) from **application capability contracts** (`packages/contracts`). A Tauri IPC command may accept a native file path while an HTTP endpoint accepts a document ID—do not force identical wire shapes when runtime semantics diverge.

## Constraints & Dependencies

- Depends only on `rust/crates/domain` (for shared value types/conversions).
- Must stay WASM-compatible (`wasm32-unknown-unknown`) via feature-gating server/Tauri-only schema macros (`openapi`, `tauri`, `wasm`).
- Generated TypeScript outputs land in `packages/contracts/src/generated/` and are drift-checked in CI via `tasknest run codegen --check`.
