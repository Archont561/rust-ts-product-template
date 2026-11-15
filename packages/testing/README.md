# `packages/testing`

Shared testing infrastructure, `@archont561/bun-test-utils` preload configuration, Effect test runtimes, Playwright fixtures, and browser-based platform simulators.

## What Belongs Here

- `src/preload.ts` — Bun test preload (`bunfig.toml` `[test] preload`) registering `@archont561/bun-test-utils` BDD helpers, custom matchers, and tag filters (`BUN_TEST_UTILS_TAGS`).
- Effect test harness helpers (deterministic `TestClock`, test runtime builders combining `packages/infrastructure/memory` `Layer`s, scoped resource teardown).
- Shared test data builders, domain fixtures, and property-based test (`fast-check`) arbitraries.
- Playwright browser/component test fixtures and **browser-based platform simulators** (simulated filesystem, dialogs, permissions, offline toggles) so Desktop/Mobile/Extension flows can be developed and visually verified in a standard browser.

## What Does NOT Belong Here

- Production runtime code (never listed in `dependencies` of any `apps/*` or non-test package—`devDependencies` only).
- Business rules duplicated from `packages/domain` or `packages/application`.

## Usage & Coverage

- Consumed by `packages/application`, `packages/frontend/*`, `packages/infrastructure/*`, and `apps/*` test suites.
- Excluded from production bundle targets and ignored in `.codecov.yml` where appropriate (`**/tests/**`, fixtures).
