import { type ToolContext, tool } from "@archont561/tasknest";

export const install = tool(
  {
    name: "install",
    description: "Install Bun workspace dependencies from bun.lock.",
    marks: ["setup"],
    requires: ["bun"],
  },
  (ctx: ToolContext) => {
    ctx.run(["bun", "install"]);
  },
);
