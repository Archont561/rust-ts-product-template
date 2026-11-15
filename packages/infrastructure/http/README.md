# `packages/infrastructure/http`

Remote HTTP and WebSocket **Effect `Layer`** implementations satisfying `packages/contracts` against the Axum backend (`apps/web`).

## What Belongs Here

- Effect `Layer`s wrapping the generated `@hey-api/openapi-ts` client from `packages/contracts/src/generated/`.
- Auth token injection, refresh coordination, retry/backoff policies, `AbortSignal` wiring for Effect fiber interruption, and WebSocket/SSE sync streams.
- Runtime decoding/validation of remote payloads via `packages/domain` Effect `Schema`s and mapping HTTP errors into typed contract errors.

## What Does NOT Belong Here

- UI components or application workflows.
- Tauri IPC, SQLite, or browser-extension messaging logic.
- Unvalidated `as SomeType` casts on raw network responses.

## Where It Is Composed

- Primary remote API transport consumed by desktop, mobile, and extension clients when syncing with `apps/web`.
- Remote sync/collaboration transport alongside local adapters in `apps/desktop`, `apps/mobile`, and `apps/extension`.
