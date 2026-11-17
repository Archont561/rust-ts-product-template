import { execFileSync } from "node:child_process";
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import { type ToolContext, tool } from "@archont561/tasknest";

/**
 * Report which CI surfaces a change touches.
 *
 * A workflow-level `paths` filter answers one question for the whole workflow: should any of it
 * run. GitHub offers no per-job equivalent, so the jobs a change cannot affect are gated on the
 * outputs this task writes instead. Skipping a job that way still reports a status for it, which a
 * workflow-level filter does not, so a required check never sits pending forever.
 *
 * Filters live beside this task in `filters.json`: one section per profile, one path-pattern list
 * per job output. Patterns follow the workflow `paths` syntax, where `**` crosses directory
 * boundaries but `*` and `?` do not.
 *
 * The task fails open: when the changed set cannot be determined (an unknown diff range, or a
 * manual/scheduled run that has no base revision) every output is `true`, so a job is never
 * skipped by mistake.
 */

const FORCE_ALL_EVENTS = new Set(["workflow_dispatch", "schedule", "repository_dispatch"]);

function toRegExp(pattern: string): RegExp {
  let out = "";
  let index = 0;
  while (index < pattern.length) {
    if (pattern.startsWith("**/", index)) {
      out += "(?:.*/)?";
      index += 3;
    } else if (pattern.startsWith("**", index)) {
      out += ".*";
      index += 2;
    } else if (pattern[index] === "*") {
      out += "[^/]*";
      index += 1;
    } else if (pattern[index] === "?") {
      out += "[^/]";
      index += 1;
    } else {
      out += pattern[index].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      index += 1;
    }
  }
  return new RegExp(`^${out}$`);
}

function diff(cwd: string, revisions: readonly string[]): string[] | null {
  try {
    const stdout = execFileSync("git", ["diff", "--name-only", ...revisions], {
      cwd,
      encoding: "utf8",
      // A range that does not resolve is an expected outcome (shallow clone, first push); the
      // caller fails open, so git's diagnostics must not leak into the step log.
      stdio: ["ignore", "pipe", "ignore"],
    });
    return stdout
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return null;
  }
}

/** Reject the empty value and the all-zero sentinel GitHub uses when there is no previous revision. */
function usable(sha: string): boolean {
  return sha.length > 0 && !/^0+$/.test(sha);
}

function changedPaths(cwd: string): string[] | null {
  const base = process.env.PR_BASE_SHA ?? "";
  const head = process.env.PR_HEAD_SHA || "HEAD";
  const before = process.env.PUSH_BEFORE_SHA ?? "";

  const resolvedBase = base || (usable(before) ? before : "");
  if (resolvedBase) {
    // The three-dot form compares against the merge base, which is what a workflow-level `paths`
    // filter does for a pull request.
    for (const revisions of [[`${resolvedBase}...${head}`], [resolvedBase, head]]) {
      const paths = diff(cwd, revisions);
      if (paths !== null) {
        return paths;
      }
    }
    return null;
  }

  return diff(cwd, ["HEAD~1...HEAD"]) ?? diff(cwd, ["HEAD~1", "HEAD"]);
}

export const detectChanges = tool(
  {
    name: "detect-changes",
    description:
      "Write one CI output per surface a change touches, from tools/ci/filters.json (fails open).",
    marks: ["ci", "fast"],
    requires: ["git"],
    options: [
      {
        name: "profile",
        type: "string",
        default: "ci",
        description: "Filters section to evaluate.",
      },
      {
        name: "changed",
        type: "string",
        default: "",
        description: "File with one changed path per line, instead of asking git.",
      },
      {
        name: "all",
        type: "boolean",
        default: false,
        description: "Report every surface as changed, ignoring the diff.",
      },
    ],
  },
  (ctx: ToolContext, args) => {
    const profile = String(args.profile ?? "ci");
    const filtersPath = join(ctx.repoRoot, "tools", "ci", "filters.json");
    const profiles = JSON.parse(readFileSync(filtersPath, "utf8")) as Record<
      string,
      Record<string, string | string[]>
    >;
    const filters = profiles[profile];
    if (!filters) {
      throw new Error(`No '${profile}' profile in tools/ci/filters.json`);
    }

    let changed: string[] | null;
    if (args.all || FORCE_ALL_EVENTS.has(process.env.GITHUB_EVENT_NAME ?? "")) {
      changed = null;
    } else if (String(args.changed ?? "")) {
      const requested = String(args.changed);
      const path = isAbsolute(requested) ? requested : join(ctx.repoRoot, requested);
      if (!existsSync(path)) {
        throw new Error(`Changed-path file not found: ${path}`);
      }
      changed = readFileSync(path, "utf8")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    } else {
      changed = changedPaths(ctx.repoRoot);
    }

    if (changed === null) {
      process.stdout.write("Changed files: unknown (failing open, every surface runs)\n");
    } else {
      process.stdout.write("Changed files:\n");
      for (const path of changed) {
        process.stdout.write(`  ${path}\n`);
      }
    }

    const lines: string[] = [];
    for (const [name, patterns] of Object.entries(filters)) {
      const candidates = typeof patterns === "string" ? [patterns] : patterns;
      const hit =
        changed === null ||
        candidates.some((pattern) => {
          const regex = toRegExp(pattern);
          return (changed as string[]).some((path) => regex.test(path));
        });
      lines.push(`${name}=${hit ? "true" : "false"}`);
    }

    process.stdout.write("Detected:\n");
    for (const line of lines) {
      process.stdout.write(`  ${line}\n`);
    }

    const output = process.env.GITHUB_OUTPUT;
    if (output) {
      appendFileSync(output, `${lines.join("\n")}\n`, "utf8");
    }
  },
);
