# `packages/build-utils`

Dev- and build-time Node/Bun configuration helpers shared across app build tools (`vite.config.ts`, `uno.config.ts`, `.storybook/main.ts`, `bunup.config.ts`) and Tasknest automation.

## What Belongs Here

- `resolvePackageDir(specifier, fromUrl)` — Resolves any workspace package's absolute directory via `createRequire(fromUrl)` + `<pkg>/package.json`, eliminating fragile `../../../` relative paths in Storybook, Vite, and UnoCSS configs.
- Shared build configuration helpers (UnoCSS `content.pipeline` workspace scanners, Vite `server.fs.allow` helpers, shared `bunup` factory presets).

## What Does NOT Belong Here

- **Any runtime application or browser code** — this package uses Node built-ins (`node:module`, `node:path`) and must **never** be imported from `packages/*/src/` or app runtime bundles.
- Test fixtures or runtime simulators (belong in `packages/testing`).
- Generic product utilities (keep pure helpers in `packages/domain` or `packages/application`).

## Publishing & Dependency Rules

- **Always private** (`"private": true`), listed only in `devDependencies` of `apps/*` and root workspace tooling.
- Enforced by `.alint.yml` (`boundary-no-dev-packages-in-runtime-src`): importing `@product/build-utils` in any runtime package `src/` fails CI.
