import { type ToolContext, tool } from "@archont561/tasknest";

export const dev = tool(
  {
    name: "dev",
    description: "Launch the Tauri v2 mobile app on Android or iOS (apps/mobile).",
    marks: ["dev"],
    persistent: true,
    options: [
      {
        name: "target",
        type: "string",
        choices: ["android", "ios"],
        default: "android",
        description: "Mobile target platform.",
      },
    ],
  },
  (ctx: ToolContext, args) => {
    const target = String(args.target ?? "android");
    ctx.run(["bun", "run", `dev:${target}`]);
  },
);
