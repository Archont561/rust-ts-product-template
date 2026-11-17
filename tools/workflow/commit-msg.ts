import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import { type ToolContext, tool } from "@archont561/tasknest";

export const commitMsg = tool(
  {
    name: "commit-msg",
    description:
      "Validate a commit message file against Conventional Commits using convco (.versionrc config).",
    marks: ["workflow", "fast"],
    requires: ["convco"],
    options: [
      {
        name: "message-file",
        type: "string",
        default: "",
        description: "Commit message file to validate; defaults to the first positional argument.",
      },
    ],
  },
  (ctx: ToolContext, args, positionals) => {
    const requested = (String(args["message-file"] ?? "") || positionals[0] || "").trim();
    if (!requested) {
      throw new Error(
        "Pass the commit message file: pixi run tools run workflow commit-msg --message-file <path>",
      );
    }

    const path = isAbsolute(requested) ? requested : join(ctx.repoRoot, requested);
    if (!existsSync(path)) {
      throw new Error(`Commit message file not found: ${path}`);
    }

    const message = readFileSync(path, "utf8");
    const result = spawnSync("convco", ["check", "--from-stdin", "--strip"], {
      cwd: ctx.repoRoot,
      input: message,
      encoding: "utf8",
    });

    if (result.status !== 0) {
      const detail = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
      throw new Error(
        [
          `Commit message does not satisfy Conventional Commits (convco check --from-stdin --strip).`,
          detail,
          "Expected: <type>(<scope>): <description> with a type listed in .versionrc.",
        ]
          .filter(Boolean)
          .join("\n"),
      );
    }

    process.stdout.write(`convco: ${requested} is a Conventional Commit\n`);
  },
);
