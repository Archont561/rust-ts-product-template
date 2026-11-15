# `packages/contracts`

The architectural spine of the TypeScript workspace: **composable Effect `Context.Tag` capability contracts** alongside **generated transport bindings** from Rust (`OpenAPI`, `tauri-specta`, `wasm-bindgen`).

## What Belongs Here

- Fine-grained Effect capability interfaces (`src/capabilities/`), e.g.:
  - `DocumentRepository`
  - `FileSystem`
  - `Authentication`
  - `Notifications`
  - `Synchronization`
  - `Search`
  - `Secrets` / `Clipboard`
- Explicit operational semantics documented on every capability method: atomicity, conflict behavior, local-vs-remote durability, typed `Effect` error channels, cancellation, and retry safety.
- Generated transport types and clients (`src/generated/`):
  - OpenAPI client/types from `@hey-api/openapi-ts`
  - Tauri v2 IPC bindings from `tauri-specta`
  - WASM module bindings from `rust/adapters/wasm`

## What Does NOT Belong Here

- Concrete `Layer` implementations (belong in `packages/infrastructure/*`).
- Application workflows or Svelte components.
- Platform-only assumptions baked into universal capabilities (e.g., desktop window management or mobile camera should be separate optional capability tags, not mandatory everywhere).

## Build & Import Rules

- Imports use `@/*` (package root), `@<org>/domain`, or `./`—no parent (`../`) traversal.
- Bundled with `bunup` (`packages: "external"`, `dts: { inferTypes: true }`) and verified with `publint` and `attw`.
- `src/generated/` is excluded from `.codecov.yml` and drift-checked by `tasknest run codegen --check`.
