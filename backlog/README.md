# Backlog

Offline-first, Git-native project management powered by **Backlog.md**. Tasks, milestones, specifications, and architectural decisions travel in the same commits and PRs as the code they govern.

## Directory Layout

- `config.yml` — Local-only configuration (`remote_operations: false`, `filesystem_only: true`, `bypass_git_hooks: false`, `auto_commit: false`).
- `decisions/` — Architectural Decision Records (`ADR-*` / `decision-*`) with statuses `proposed | accepted | superseded | deprecated`.
- `docs/` — Long-lived architecture specifications, platform capability matrices, and operational runbooks.
- `milestones/` — Milestone records grouping delivery outcomes (informational; only task `dependencies` create hard blockers).
- `tasks/` — Work items (`APP-*`) with YAML frontmatter, Acceptance Criteria, Definition of Done checklists, and explicit dependency references.

## Conventions & Validation

- Prefer CLI commands (`pixi run --frozen bun x --no-install backlog ...`) over hand-editing YAML frontmatter.
- Use `backlog board` (terminal Kanban) or `backlog browser` (local web UI) for visual planning.
- CI enforces two integrity layers:
  1. `.alint.yml` checks filename conventions and relative Markdown links inside and leaving `backlog/`.
  2. `tools/repo/backlog.ts` checks unique IDs, filename-to-frontmatter ID equality, valid status enums, and ensures every `milestone:` and `dependencies:` reference resolves to an existing record.
- Excluded from `.codecov.yml` coverage tracking; `backlog/docs/` and `backlog/decisions/` are prose-linted by Vale while `backlog/tasks/` stays concise.
