import { type ToolContext, tool } from "@archont561/tasknest";

export const dev = tool(
  {
    name: "dev",
    description: "Run the Rust Axum web server locally (apps/web).",
    marks: ["dev"],
    persistent: true,
    requires: ["cargo"],
  },
  (ctx: ToolContext) => {
    ctx.run(["cargo", "run"]);
  },
);
