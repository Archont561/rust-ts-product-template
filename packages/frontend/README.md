# `packages/frontend`

Shared **Svelte 5** presentation layer providing the design system, accessible headless interactions (**Bits UI** / **Zag.js**), **UnoCSS** styling tokens, and reusable feature flows consumed across Web, Desktop, Mobile, and Browser Extensions.

## Structure

- `ui/` — Pure design tokens, UnoCSS preset, accessible Svelte 5 primitives/components, and Storybook stories (zero application or platform dependencies).
- `features/` — Reusable screens, forms, and interactive product flows wired to `packages/application` via injected Effect runtime context (zero concrete `infrastructure/*` imports).

## Sharing Strategy

> **Share concepts, components, and behavior. Specialize navigation, layouts, and native surfaces.**

- Dialogs, menus, inputs, command palettes, document editors, and interaction machines are shared.
- Top-level routing (SvelteKit routes vs Tauri windows vs MV3 popup/sidepanel/options views) and platform-specific shells (desktop sidebar vs mobile bottom sheet/drawer) are composed in `apps/*`.

## Hard Boundary Rules

- Never import `@tauri-apps/*`, `@wxt-dev/*`, `chrome.*`/`browser.*`, or concrete `packages/infrastructure/*` layers here.
- All external data and side effects arrive via props, Svelte context holding an Effect runtime, or callbacks.
- Visual and interaction regression tests run through Storybook (`@storybook/addon-vitest`) and Playwright component specs without requiring a live backend.
