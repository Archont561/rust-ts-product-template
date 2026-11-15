# `rust/crates/sync`

Offline-first synchronization engine, change tracking, deterministic merge/conflict resolution, and cursor/delta calculation shared across all runtimes.

## What Belongs Here

- Delta/changelog generation, vector clocks or revision cursors, and idempotent patch application.
- Deterministic conflict detection and merge strategies over domain entities.
- Abstract sync transport traits (push/pull batches) decoupled from HTTP, WebSockets, or offline queues.
- Serialization-stable sync payloads reusable identically in Rust servers, Tauri native clients, and browser/extension WASM builds.

## What Does NOT Belong Here

- Concrete HTTP clients (`reqwest`), WebSocket loops, or Tauri background schedulers (owned by adapters and platform shells).
- Direct SQL queries (depend on `rust/crates/storage` traits instead).
- UI conflict-resolution dialogs (belong in `packages/frontend/features`).

## Operational Semantics

Every sync operation must document and test:

- **Idempotency:** Replaying the same batch twice produces the same state.
- **Commutativity / convergence:** Clients applying out-of-order server deltas converge deterministically.
- **Partial failure & retry safety:** Network interruption mid-batch leaves local state consistent.

## Constraints & Testing

- Must stay **WASM-clean** (`wasm32-unknown-unknown`) so Web, MV3 Extensions, and Capacitor/mobile runtimes execute the exact same merge engine as Desktop and Server.
- Tested heavily with property-based tests (out-of-order delivery, duplicate batches, concurrent edits, offline reconnect).
