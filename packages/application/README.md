# `packages/application`

Pure, platform-agnostic **Effect** use-cases, workflows, and state orchestration that express *what the product does* solely in terms of `packages/domain` and `packages/contracts`.

## What Belongs Here

- Application workflows and use-case services composed via `Effect.gen` / `Effect.Service`.
- Optimistic update choreography, retry/backoff policies, cancellation handling, and structured error recovery.
- Cross-capability coordination (e.g., save document → update search index → schedule sync → emit notification).
- Executable specifications:
  - `features/*.feature` — Gherkin BDD scenarios (linted fail-closed by `gherlint`).
  - `tests/` — Fast, deterministic pure-logic BDD and property-based tests executed via `@archont561/bun-test-utils` against `packages/infrastructure/memory` layers.

## What Does NOT Belong Here

- Any import from `packages/infrastructure/*`, `packages/frontend/*`, or `apps/*` (enforced by `.alint.yml` and `biome.json`).
- Direct calls to `fetch`, `chrome.*`, `browser.*`, `@tauri-apps/*`, or `window`—every side effect must go through an Effect capability tag from `packages/contracts`.
- Platform branching (`if (isTauri)` / `if (isMobile)`)—model capability presence through explicit optional contracts instead.

## Testing Philosophy

Because every workflow runs against in-memory Effect `Layer`s, **all core product behavior is tested in milliseconds** under `bun test --coverage` without launching Tauri, Docker, or a browser.
