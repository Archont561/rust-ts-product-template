# `packages/frontend/ui`

Pure Svelte 5 design system: design tokens, shared UnoCSS preset, headless interaction primitives (**Bits UI** with Svelte 5 `child` snippets and **Zag.js** state machines), styled components, and Storybook stories.

## What Belongs Here

- Semantic design tokens (colors, spacing, typography, radii, motion, dark/light themes) and the shared UnoCSS preset.
- Accessible primitives and composite UI components (buttons, dialogs, drawers/bottom-sheets for mobile, popovers, tabs, tables, command palettes).
- Svelte 5 component stories (`*.stories.svelte`) exercising states, keyboard accessibility, and responsive breakpoints.

## What Does NOT Belong Here

- `packages/application`, `packages/contracts`, or `packages/infrastructure/*` imports.
- Effect runtimes, network calls, routing (`$app/*`), Tauri IPC, or WebExtension APIs.
- Product-specific domain orchestration (belongs in `packages/frontend/features`).

## Dependencies & Testing

- Depends only on Svelte 5, Bits UI / Zag.js, UnoCSS utilities, and pure icon/formatting helpers.
- Verified with `@storybook/addon-vitest` + Playwright component tests in the browser test lane.
- `*.stories.svelte` files are excluded from `.codecov.yml`.
