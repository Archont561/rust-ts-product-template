import { type ToolContext, tool } from "@archont561/tasknest";

export const build = tool(
  {
    name: "build",
    description: "Build the static Fumadocs showcase and documentation site into apps/docs/out.",
    marks: ["build", "docs"],
    requires: ["bun"],
  },
  (ctx: ToolContext) => {
    ctx.run(["bun", "run", "build"]);
  },
);
