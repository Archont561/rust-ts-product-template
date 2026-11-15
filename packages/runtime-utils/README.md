# `packages/runtime-utils`

Tiny, strictly pure, **universal JavaScript** helper primitives shared across all runtime layers (Browser, Tauri WebView, MV3 Extension workers, Node, and Bun).

## What Belongs Here

- Generic, product-agnostic helpers not already provided by `effect` (`Array`, `Option`, `Either`, `Match`, `Encoding`, `Schedule`):
  - TypeScript exhaustiveness helpers (`assertNever`)
  - Small pure formatting, normalization, or byte helpers needed across both `domain` and `ui`

## What Does NOT Belong Here

- **Any product domain concepts** (`Document`, `User`, business rules — belong in `packages/domain`).
- **Any Node built-ins** (`node:*`), DOM globals (`window`, `document`), or platform SDKs (`@tauri-apps/*`, `@wxt-dev/*`).
- Build/config utilities (belong in `packages/build-utils`) or test harnesses (belong in `packages/testing`).
- Re-implementations of functions already shipped by `effect`.

## Dependency & Boundary Rules

- **Strict leaf:** Zero internal `@product/*` dependencies (enforced by `.alint.yml` `boundary-runtime-utils-is-pure-leaf`).
- **Always private** (`"private": true`), bundled cleanly with `bunup` (`target: "browser"`).
- Safe to import from any runtime package (`domain`, `contracts`, `application`, `frontend/*`, `infrastructure/*`, `apps/*`).
