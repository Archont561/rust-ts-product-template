# `apps/desktop`

Thin **Tauri v2** native desktop application shell targeting **Linux, macOS, and Windows**.

## Responsibilities

- Native `src-tauri/` composition root wiring `rust/adapters/tauri`, Tauri v2 desktop plugins (filesystem dialogs, tray, updater, global shortcuts, strong/secure storage, notifications), capability/permission JSONs, icons, and code signing.
- Frontend composition root wiring `packages/infrastructure/tauri` (local native SQLite/filesystem/OS capabilities) + `packages/infrastructure/http` (remote sync/collaboration) into `packages/frontend/features`.
- Desktop-specialized window chrome, resizable split panes, menus, and keyboard-first layouts built from shared `packages/frontend/ui` primitives.

## What Does NOT Belong Here

- Core domain, storage, or sync business rules (belong in `rust/crates/*` and `packages/application`).
- Reusable UI components (belong in `packages/frontend/ui`).
- Mobile-specific navigation or store packaging (owned by `apps/mobile`).
- WASM loading—Desktop invokes the shared Rust crates natively.

## Notes

- Scoped Tasknest tasks live in `apps/desktop/tools/` (`namespace = "desktop"`, `project_root = "apps/desktop"`).
- CI environment bootstrapping for Linux/macOS/Windows lives in `.github/actions/setup-tauri/action.yml`.
- Release installers (`.dmg`, `.AppImage`/`.deb`, `.msi`/`.exe`) are published on `v*` tags and linked from `apps/docs` downloads.
