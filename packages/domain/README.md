# `packages/domain`

Pure TypeScript domain models, `Effect` `Schema` definitions, branded IDs, value objects, and client-side invariants shared across every frontend runtime.

## What Belongs Here

- Branded domain IDs (`DocumentId`, `ProjectId`, `UserId`) and value objects.
- `Effect` `Schema` decoders/encoders used for runtime validation at external boundaries (HTTP responses, Tauri events, MV3 extension messages, storage reads).
- Pure domain calculations, predicates, sorting/filtering rules, and tagged domain error types (`Data.TaggedError`).

## What Does NOT Belong Here

- Side effects, `fetch`, `localStorage`, `window`/`document`, `@tauri-apps/*`, or `@wxt-dev/*`.
- Effect `Context.Tag` service interfaces (belong in `packages/contracts`).
- Use-case orchestration (belongs in `packages/application`).
- Svelte components or CSS/UnoCSS classes.

## Dependencies & Build

- **Zero internal workspace dependencies** (root of the TypeScript package DAG).
- Strict TypeScript (`exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`), `@/*` internal aliases, bundled cleanly with `bunup`.
- Tested with fast pure unit and property-based tests via `bun test`.
