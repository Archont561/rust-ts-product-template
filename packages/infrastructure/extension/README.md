# `packages/infrastructure/extension`

Multi-browser WebExtension (MV3) **Effect `Layer`** implementations satisfying `packages/contracts` across **Chrome, Firefox, and Safari** using `@wxt-dev/browser` and `@webext-core/*`.

## What Belongs Here

- Effect `Layer`s backed by `browser.storage.*`, alarms, notifications, active-tab context, and typed cross-context messaging (`@webext-core/messaging` / `@webext-core/proxy-service`).
- Strict **runtime `Effect` `Schema` validation** on every message crossing popup ↔ sidepanel ↔ content script ↔ background service worker boundaries (TypeScript types alone do not protect runtime boundaries).
- **MV3 suspension-safe state management:** Never rely on long-lived in-memory singletons in the background service worker; persist durable state to `browser.storage` / IndexedDB.

## What Does NOT Belong Here

- Extension manifest definitions, WXT entrypoints (`popup/`, `sidepanel/`, `background/`, `content/`), or store packaging (owned by `apps/extension`).
- Shared UI components or business workflows.

## Import Boundary

This is the **only** shared TS package allowed to import `@wxt-dev/browser` or `@webext-core/*` (enforced via `biome.json` and `.alint.yml`).
