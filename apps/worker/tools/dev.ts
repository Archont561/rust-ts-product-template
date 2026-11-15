import { type ToolContext, tool } from "@archont561/tasknest";

export const dev = tool(
  {
    name: "dev",
    description: "Run the Cloudflare Worker locally with Wrangler (apps/worker).",
    marks: ["dev"],
    persistent: true,
  },
  (ctx: ToolContext) => {
    ctx.run(["bun", "run", "dev"]);
  },
);
