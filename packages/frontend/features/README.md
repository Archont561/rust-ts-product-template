# `packages/frontend/features`

Reusable Svelte 5 product flows and feature views (e.g., document editor, project explorer, search panel, sync status indicator, auth forms) that bind `packages/frontend/ui` components to `packages/application` Effect workflows.

## What Belongs Here

- Feature-level Svelte 5 components, reactive runes (`$state` / `$derived`) bridged to Effect streams/fibers, and optimistic UI states.
- Feature-scoped layout compositions usable inside Web pages, Tauri desktop/mobile views, or Extension sidepanels/popups.
- Component integration specs testing real user flows against `packages/infrastructure/memory` Effect `Layer`s.

## What Does NOT Belong Here

- Concrete `packages/infrastructure/*` runtime layers (`http`, `tauri`, `wasm`, `extension`)—the Effect runtime is provided by the host shell in `apps/*` via Svelte context.
- Hardcoded SvelteKit routing (`$app/navigation`)—accept navigation callbacks or a router capability contract so components run identically in Tauri and WXT extensions.
- Direct `@tauri-apps/*` or `@wxt-dev/*` imports.

## Allowed Dependencies

- `@<org>/domain`
- `@<org>/contracts`
- `@<org>/application`
- `@<org>/ui` (`packages/frontend/ui`)
