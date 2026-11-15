# `apps/extension`

Thin **WXT** multi-browser **Manifest V3** extension shell targeting **Chrome, Firefox, and Safari**.

## Responsibilities

- WXT manifest configuration (`wxt.config.ts`), browser-specific permissions, CSP (`'wasm-unsafe-eval'` if loading `packages/infrastructure/wasm`), and store packaging (`zip` / submission artifacts for Chrome Web Store, Firefox AMO, and Safari Web Extension).
- Thin MV3 entrypoints (`popup/`, `sidepanel/`, `options/`, `background/`, `content/`) composing `packages/infrastructure/extension`, `packages/infrastructure/http`, and optionally `packages/infrastructure/wasm` into `packages/frontend/features`.
- Explicit separation of responsibilities between UI surfaces, content scripts, and the **ephemeral MV3 background service worker** (no long-lived in-memory state assumptions).

## What Does NOT Belong Here

- Reusable UI primitives or application workflows (belong in `packages/frontend/*` and `packages/application`).
- Direct untyped `chrome.*` calls scattered in UI components (route all browser APIs through `packages/infrastructure/extension` with runtime `Effect` `Schema` validation).

## Notes

- Scoped Tasknest tasks live in `apps/extension/tools/` (`namespace = "ext"`, `project_root = "apps/extension"`).
- Published browser store links are surfaced on the `apps/docs` downloads page.
