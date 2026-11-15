import { type ToolContext, tool } from "@archont561/tasknest";

export const dev = tool(
  {
    name: "dev",
    description: "Run the Fumadocs showcase and documentation site (apps/docs).",
    marks: ["dev"],
    persistent: true,
  },
  (ctx: ToolContext) => {
    ctx.run(["bun", "run", "dev"]);
  },
);
