# `apps/mobile`

Thin native mobile application shell targeting **iOS and Android** (via **Tauri v2 Mobile** for native Rust integration, or **Capacitor** with `packages/infrastructure/wasm` if prioritizing webview plugins).

## Responsibilities

- Mobile native project shell (Android Gradle / iOS Xcode project, permissions, splash screens, deep links, biometrics, haptics, share sheet, and store signing).
- Composition root wiring local native capabilities (`packages/infrastructure/tauri` or mobile plugins + `packages/infrastructure/wasm`) alongside `packages/infrastructure/http` remote sync into `packages/frontend/features`.
- Mobile-specialized navigation, safe-area insets, touch gestures, and bottom-sheet drawers (`vaul-svelte`) built from shared `packages/frontend/ui` primitives.

## What Does NOT Belong Here

- Core domain, storage, or sync business rules (belong in `rust/crates/*` and `packages/application`).
- Desktop window management or keyboard-only layouts (owned by `apps/desktop`).
- Reusable UI primitives (belong in `packages/frontend/ui`).

## Notes

- Scoped Tasknest tasks live in `apps/mobile/tools/` (`namespace = "mobile"`, `project_root = "apps/mobile"`).
- Release builds (App Store, Google Play, direct `.apk`) are linked from `apps/docs` downloads.
