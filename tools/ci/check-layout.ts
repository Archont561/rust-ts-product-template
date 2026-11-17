import { type Dirent, readdirSync } from "node:fs";
import { join } from "node:path";
import { type ToolContext, tool } from "@archont561/tasknest";

/**
 * Enforce the `.github/` layout.
 *
 * `alint` can express a file allowlist but not a directory one — `dir_only_contains` looks at
 * direct-child files only, `filename_regex` matches files only, and the glob engine has no
 * negated-extglob, so "no folder other than these" cannot be written as a rule. This task is the
 * allowlist for that half of the policy; the matching `.alint.yml` rules keep the declarative
 * pieces (no `scripts/` directory, required files present).
 */

const ALLOWED_DIRS = ["ISSUE_TEMPLATE", "actions", "workflows"];

const ALLOWED_FILES = [
  "CODEOWNERS",
  "CONTRIBUTING.md",
  "FUNDING.yml",
  "PULL_REQUEST_TEMPLATE.md",
  "SECURITY.md",
  "copilot-instructions.md",
  "dependabot.yaml",
  "dependabot.yml",
];

function readEntries(dir: string): Dirent[] {
  try {
    return readdirSync(dir, { withFileTypes: true });
  } catch {
    throw new Error(`${dir} is missing; nothing to verify.`);
  }
}

export const checkLayout = tool(
  {
    name: "check-layout",
    description:
      "Enforce the .github/ layout: only workflows/, actions/, and ISSUE_TEMPLATE/ plus GitHub convention files.",
    marks: ["ci", "fast", "offline"],
    requires: [],
  },
  (ctx: ToolContext) => {
    const githubDir = join(ctx.repoRoot, ".github");
    const violations: string[] = [];

    const entries = readEntries(githubDir);

    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      if (entry.isDirectory()) {
        if (!ALLOWED_DIRS.includes(entry.name)) {
          violations.push(
            `.github/${entry.name}/ is not an allowed directory (allowed: ${ALLOWED_DIRS.join(", ")}). ` +
              "Move repository automation under tools/<group>/ instead.",
          );
        }
      } else if (!ALLOWED_FILES.includes(entry.name)) {
        violations.push(
          `.github/${entry.name} is not a recognized GitHub convention file (allowed: ${ALLOWED_FILES.join(", ")}).`,
        );
      }
    }

    for (const entry of readdirSync(join(githubDir, "workflows"), { withFileTypes: true })) {
      if (!/\.ya?ml$/.test(entry.name)) {
        violations.push(`.github/workflows/${entry.name} must be a YAML workflow document.`);
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `.github layout violations:\n${violations.map((v) => `  - ${v}`).join("\n")}`,
      );
    }

    process.stdout.write(
      `.github layout OK: ${ALLOWED_DIRS.join(", ")} directories and ${ALLOWED_FILES.length} convention files allowed.\n`,
    );
  },
);
