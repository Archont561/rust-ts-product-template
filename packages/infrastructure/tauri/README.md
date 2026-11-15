# `packages/infrastructure/tauri`

Native Desktop and Mobile **Effect `Layer`** implementations satisfying `packages/contracts` via **Tauri v2** IPC commands and native plugins.

## What Belongs Here

- Effect `Layer`s calling the `tauri-specta`-generated typed commands and event listeners from `packages/contracts/src/generated/`.
- Bridges to official/community Tauri v2 plugins (filesystem dialogs, notifications, clipboard, secure storage, OS share/deep links, mobile biometrics/haptics).
- Error translation from Tauri IPC errors into typed Effect contract errors with explicit local-durability semantics.

## What Does NOT Belong Here

- Business rules (owned by `rust/crates/*` and `packages/application`).
- Svelte components or routing (owned by `packages/frontend/*`, `apps/desktop`, and `apps/mobile`).
- Web-only fallbacks—keep platform layers focused and compose hybrid capabilities explicitly in `apps/desktop` and `apps/mobile`.

## Import Boundary

This is the **only** shared TS package allowed to import `@tauri-apps/*` (enforced via `biome.json` and `.alint.yml`).
