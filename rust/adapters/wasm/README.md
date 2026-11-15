# `rust/adapters/wasm`

WebAssembly binding layer compiling shared Rust crates (`domain`, `contracts`, `sync`, and pure `storage` utilities) into an ESM + `.wasm` package consumed by Web, MV3 Browser Extensions, and Capacitor/webview runtimes.

## What Belongs Here

- Thin `#[wasm_bindgen]` entrypoints delegating straight to `rust/crates/*`.
- Serialization glue (`serde-wasm-bindgen`) mapping Rust DTOs and typed errors to JS-friendly objects.
- Panic hook initialization and WASM-safe async/batch helpers.

## What Does NOT Belong Here

- Business rules or sync algorithms (must live in `rust/crates/*`).
- Browser DOM manipulation, `IndexedDB` orchestration, or Effect `Layer` wiring (owned by `packages/infrastructure/wasm`).
- Server-only or native filesystem/SQLite crates.

## Build Pipeline

Built directly without deprecated `rustwasm` wrappers via `tasknest run rust wasm`:

1. `cargo build --target wasm32-unknown-unknown --release`
2. `wasm-bindgen --target web --out-dir ...`
3. `wasm-opt -Oz` (from Pixi `binaryen`)

Generated JS/TS/WASM artifacts are consumed via `packages/contracts` and wrapped into Effect services by `packages/infrastructure/wasm`.

## Runtime Notes

- **MV3 Extensions:** Requires `'wasm-unsafe-eval'` in `content_security_policy.extension_pages` and explicit URL loading via `browser.runtime.getURL(...)` (never inline base64 `eval`).
- **Tauri Desktop & Mobile:** Do **not** route Tauri through WASM—Tauri calls the Rust crates natively via `rust/adapters/tauri`.
