# `rust/adapters/tauri`

Reusable Tauri v2 IPC command and native plugin adapter connecting the shared Rust core crates (`domain`, `storage`, `sync`) to Desktop (Linux/macOS/Windows) and Mobile (Android/iOS) runtimes.

## What Belongs Here

- Thin `#[tauri::command]` handlers annotated with `#[specta::specta]` delegating immediately to `rust/crates/*`.
- Typed Tauri event emitters and state wiring (`tauri::State<'_, AppState>`).
- Bridge code integrating official/community Tauri v2 plugins (SQLite, filesystem, secure storage/stronghold, dialogs, notifications, deep links).
- Binding export routine (`tauri-specta`) producing strongly typed TypeScript command/event wrappers for `packages/contracts/src/generated/`.

## What Does NOT Belong Here

- Business rules or sync algorithms (belong in `rust/crates/*`).
- App bundle config, icons, `tauri.conf.json`, capability JSONs, or `src-tauri/src/main.rs` (owned by `apps/desktop` and `apps/mobile`).
- Shared auth assumptions with Axum—local desktop/mobile trust boundaries differ from remote multi-tenant HTTP boundaries.

## Testing

- Unit/integration tests invoking command logic against temporary SQLite/filesystem fixtures without requiring a full GUI window.
- End-to-end native IPC tests live under `apps/desktop` and `apps/mobile`.
