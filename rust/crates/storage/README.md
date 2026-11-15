# `rust/crates/storage`

Shared Rust persistence abstractions, repository traits, query models, and local/server storage implementations backing the domain core.

## What Belongs Here

- Repository and unit-of-work traits defining clear persistence semantics (atomicity, optimistic concurrency/conflict errors, idempotency, cancellation).
- Local embedded SQLite implementation (feature-gated) shared by Desktop and Mobile native runtimes.
- Server database adapters and SQL migration definitions (feature-gated so client builds never pull server-only drivers).
- In-memory repository implementations for deterministic Rust integration tests.

## What Does NOT Belong Here

- Domain invariants that do not depend on persistence (belong in `rust/crates/domain`).
- Sync conflict-resolution algorithms (belong in `rust/crates/sync`).
- HTTP or Tauri IPC handlers (belong in `rust/adapters/*`).

## Feature Flag Discipline

Gate runtime-specific backends behind explicit Cargo features so every target compiles only what it needs:

- `default` / trait-only + in-memory: WASM-clean and zero native C dependencies.
- `sqlite`: embedded SQLite for Tauri Desktop & Mobile.
- `postgres` (or server DB): enabled only by `rust/adapters/axum` / `apps/web`.

## Testing

- Contract test suite parameterized over the repository traits so in-memory, SQLite, and server implementations prove identical semantics.
