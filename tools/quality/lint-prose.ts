import { type ToolContext, tool } from "@archont561/tasknest";

export const lintProse = tool(
  {
    name: "lint-prose",
    description: "Lint top-level Markdown documentation prose with Vale.",
    marks: ["lint", "docs"],
    requires: ["vale"],
  },
  (ctx: ToolContext) => {
    ctx.run(["vale", "README.md", "AGENTS.md", "backlog/README.md"]);
  },
);
