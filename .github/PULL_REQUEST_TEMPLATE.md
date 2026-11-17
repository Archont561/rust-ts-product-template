<!-- generated from templates/github/PULL_REQUEST_TEMPLATE.md.j2 — do not edit by hand; regenerate with `pixi run tools run documentation sync --write` -->

# Pull Request

## Summary

- What changed and why?
- Related issue or `backlog/` task ID:

## Affected Surfaces

- [ ] `apps/desktop`
- [ ] `apps/docs`
- [ ] `apps/extension`
- [ ] `apps/mobile`
- [ ] `apps/web`
- [ ] `apps/worker`
- [ ] `rust/crates/*` or `rust/adapters/*`
- [ ] `packages/*`
- [ ] Tooling, CI, or documentation (`tools/`, `.alint/`, `templates/`, `.github/`)

## Verification Checklist

Run checks through the single `pixi run tools` entrypoint before requesting review:

- [ ] `pixi run tools check`
- [ ] `pixi run tools run documentation sync` (regenerate with `--write` if templates or counts changed)
- [ ] `pixi run tools run quality lint-repo` and `pixi run tools run testing test-policy`
- [ ] `pixi run tools run quality lint-ts` and `pixi run tools run quality lint-md`
- [ ] `pixi run tools run quality lint-actions` and `pixi run tools run quality lint-toml` (when workflows or TOML changed)
- [ ] `pixi run tools run --each typecheck` and `pixi run tools run testing test-ts`
- [ ] `pixi run -e rust tools run quality lint-rust-format`, `pixi run -e rust tools run quality lint-rust`, and `pixi run -e rust tools run testing test-rust` (when Rust changed)
- [ ] `pixi run tools run quality links` and `pixi run tools run quality lint-prose` (when docs changed)

## Architecture Guardrails

- [ ] Contracts (`rust/crates/contracts`, `packages/contracts`) remain dependency-free.
- [ ] Services (`rust/crates/services`) remain transport-independent; adapters stay thin.
- [ ] TypeScript infrastructure (`packages/infrastructure/*`) remains injectable.
- [ ] No extra tasks were added to `pixi.toml` or `"scripts"` to root `package.json`.
- [ ] Every commit message in this branch follows Conventional Commits as declared in `.versionrc`.
