---
name: tasknest
description: "Author, validate, and execute repository automation with Tasknest 0.4.0 via the single `pixi run tools` entrypoint. Use when adding or modifying tasks in `tools/<group>/*.ts`, `apps/*/tools/*.ts`, or `tasknest.toml`, running `--each` / `-p` / `--mark` selectors."
license: MIT
---

# Tasknest (`pixi run tools`)

This repository routes **all** human and coding-agent automation through a single Pixi entrypoint (`pixi run tools`), backed by **`@archont561/tasknest@0.4.0`** and enforced by `.alint/schemas/pixi-tasks.schema.json`, `.alint/schemas/root-package.schema.json`, and `.alint/schemas/tasknest.schema.json`.

## Hard Invariants

1. **Never add extra `[tasks]` or `[feature.*.tasks]` to `pixi.toml`.** `pixi.toml` only defines `tools = "bun x --bun --no-install tasknest"`.
2. **Never add `"scripts"` to the root `package.json`.** Root-level workflows belong in `tools/<group>/*.ts`.
3. **Every task must declare a non-empty `description` and only registered `[marks]`** from `tasknest.toml` (`[checks] strict = true`, `require_description = true`, `unknown_marks = "error"`).
4. **Mark long-running servers/watchers with `persistent: true`** (never combine `persistent: true` with `cache: true`).

## Running Tasks

```bash
pixi run tools ls                         # Discover all root, app, and package tasks
pixi run tools check                      # Validate task graph, descriptions, and marks
pixi run tools help <task>                # Inspect options, marks, and dependencies
pixi run tools plan <task>                # Preview dependency execution order
pixi run tools run <task>                 # Execute a task (e.g. `pixi run tools run quality lint-repo`)
pixi run tools run --mark fast            # Execute all tasks with a given mark
pixi run tools run --each typecheck       # Run a manifest script across all 13 packages
pixi run tools run -p pkg.contracts test  # Run a package-scoped task
pixi run -e rust tools run testing test-rust      # Run Rust tasks inside the `rust` Pixi environment
```

### Forwarding Dashed Flags to Wrapped CLIs

Tasknest consumes the first `--` when resolving task tokens; pass a second `--` when forwarding flags starting with `-` to passthrough tasks like `skills` or `backlog`:

```bash
pixi run tools run workflow skills -- -- list
pixi run tools run workflow skills -- -- add <owner/repo> --skill <name> --agent codex -y
pixi run tools run workflow backlog -- -- task list --plain
```

## Authoring a New Task

Create a TypeScript module under `tools/<group>/<name>.ts` (the directory becomes a CLI group such as `quality lint-ts`) or `apps/<app>/tools/<name>.ts` (namespaced under `apps/<app>` in `tasknest.toml`):

```ts
import { type ToolContext, tool } from "@archont561/tasknest";

export const example = tool(
  {
    name: "example",
    description: "One-line description of what this task does.",
    marks: ["fast", "offline"],
    requires: ["bun"],
    persistent: false,
    options: [
      {
        name: "fix",
        type: "boolean",
        default: false,
        description: "Apply automatic fixes when available.",
      },
    ],
  },
  (ctx: ToolContext, args, positionals) => {
    const argv = ["bun", "--version", ...positionals];
    if (args.fix === true) {
      argv.push("--fix");
    }
    ctx.run(argv);
  },
);
```

- Use `process.stdout.write(...)` instead of `console.log(...)` (enforced by `alint`'s `agent-no-console-log` rule).
- If a new mark is needed, register it with a description under `[marks]` in `tasknest.toml`.

## Post-Edit Verification Checklist

```bash
pixi run tools check
pixi run tools run quality lint-repo
pixi run tools run quality lint-ts
```
