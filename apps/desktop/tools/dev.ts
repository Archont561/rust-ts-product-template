import { type ToolContext, tool } from "@archont561/tasknest";

export const dev = tool(
  {
    name: "dev",
    description: "Launch the Tauri v2 desktop app in dev mode (apps/desktop).",
    marks: ["dev"],
    persistent: true,
  },
  (ctx: ToolContext) => {
    ctx.run(["bun", "run", "dev"]);
  },
);
