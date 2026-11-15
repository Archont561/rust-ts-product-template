# `apps/docs`

**Fumadocs** static-export website serving as the public **product showcase**, **user & API documentation**, and **unified Downloads hub** for Desktop, Mobile, and Browser Extensions.

## Responsibilities

- **Product Showcase & Guides:** Landing pages, feature walkthroughs, architecture overview, and MDX documentation (`content/docs/**`, prose-linted by Vale).
- **API Reference (`fumadocs-openapi`):** Renders interactive endpoint documentation directly from the OpenAPI specification exported by `apps/web` (`rust/adapters/axum`).
- **Downloads Portal (`content/downloads.json`):** Driven by a release-generated manifest containing version, `convco` changelog links, direct GitHub Release installer URLs + SHA-256 checksums for Desktop (`.dmg`, `.AppImage`/`.deb`, `.msi`), Mobile (App Store, Google Play, `.apk`), and Browser Extensions (Chrome Web Store, Firefox AMO, Safari).

## What Does NOT Belong Here

- Shared Svelte 5 packages (`@product/ui`, `@product/features`) or Effect runtime layers—Fumadocs is React-based and stays strictly isolated from the Svelte/Tauri/WXT frontend workspace.
- Hardcoded release download URLs or hand-maintained API endpoint docs.
- Product business logic.

## Notes

- Excluded from `.codecov.yml` coverage tracking (`apps/docs/**`).
- Scoped Tasknest tasks live in `apps/docs/tools/` (`namespace = "docs"`, `project_root = "apps/docs"`).
- Deployed statically (GitHub Pages / Cloudflare Pages) when documentation changes or a new `v*` release cuts.
