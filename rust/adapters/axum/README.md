# `rust/adapters/axum`

Reusable Axum HTTP and WebSocket transport adapter exposing the shared Rust domain, storage, and sync services as a typed remote API.

## What Belongs Here

- Axum `Router` composition, extractors, middleware (authentication, authorization, CORS, rate limiting, tracing, request IDs).
- `#[utoipa::path]` route annotations and `OpenApi` spec assembly for generating `openapi.json`.
- Mapping domain/storage/sync errors into structured HTTP status codes and RFC-style JSON error envelopes.
- WebSocket / SSE sync endpoints.

## What Does NOT Belong Here

- Core domain validation or business workflows (must live in `rust/crates/*`).
- Process entrypoint (`main.rs`), CLI flags, or deployment config (owned by `apps/web`).
- Tauri IPC assumptions—Axum and Tauri have separate authentication, authorization, and composition boundaries.

## Contract Generation

`apps/web` exports the OpenAPI spec produced by this adapter (`tasknest run web openapi`), which `@hey-api/openapi-ts` turns into typed TypeScript clients in `packages/contracts/src/generated/` and `apps/docs` renders via `fumadocs-openapi`.

## Testing

- HTTP contract and integration tests using Axum `tower::ServiceExt::oneshot` against in-memory and real database fixtures.
