import { type ToolContext, tool } from "@archont561/tasknest";

export const lintActions = tool(
  {
    name: "lint-actions",
    description: "Lint GitHub Actions workflows with actionlint (shell checks run via shellcheck).",
    marks: ["lint", "fast"],
    requires: ["actionlint"],
  },
  (ctx: ToolContext, _args, positionals) => {
    // With no positional arguments actionlint lints every workflow under .github/workflows.
    ctx.run(["actionlint", ...positionals]);
  },
);
