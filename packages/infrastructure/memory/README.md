# `packages/infrastructure/memory`

Deterministic, in-memory **Effect `Layer`** implementations of every capability contract in `packages/contracts`.

## What Belongs Here

- In-memory implementations of `DocumentRepository`, `FileSystem`, `Authentication`, `Notifications`, `Synchronization`, `Search`, and optional platform capabilities.
- Controllable failure injection, latency simulation, conflict triggers, and offline/online toggles for testing edge cases cleanly.
- Browser-simulator presets allowing Desktop, Mobile, and Extension workflows to run inside a standard web browser during local development and visual testing.

## What Does NOT Belong Here

- Real network calls, real filesystem I/O, or platform SDK imports.
- Duplicated business rules (implement only contract storage/transport mechanics; use-case rules live in `packages/application`).

## Role in Architecture

Every capability added to `packages/contracts` must ship a matching simulated `Layer` here that satisfies the exact same contract semantics and contract test suite as production adapters.
