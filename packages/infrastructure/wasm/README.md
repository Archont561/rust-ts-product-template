# `packages/infrastructure/wasm`

WebAssembly **Effect `Layer`** adapter loading the compiled Rust core (`rust/adapters/wasm`) for browser runtimes that cannot run native Rust directly (Web, MV3 Browser Extensions, and Capacitor/webview mobile).

## What Belongs Here

- Lazy, idempotent `.wasm` module initialization supporting both standard Web URLs and MV3 extension URLs (`browser.runtime.getURL(...)`).
- Optional Web Worker / MV3 Offscreen Document offloading so heavy sync or search operations never block the UI thread.
- Effect `Layer`s exposing Rust `domain`/`sync` computations behind `packages/contracts` tags with runtime schema validation at the JS↔WASM boundary.

## What Does NOT Belong Here

- Native Tauri code (Tauri calls Rust natively through `packages/infrastructure/tauri`—never load WASM inside Tauri).
- Business rules re-implemented in TypeScript (delegate to the compiled Rust WASM exports).

## Testing

- Contract parity tests verifying identical outputs between native Rust, `packages/infrastructure/wasm`, and `packages/infrastructure/memory`.
