import { type ToolContext, tool } from "@archont561/tasknest";

export const sandbox = tool(
  {
    name: "sandbox",
    description:
      "Manage offline Pixi development environments and workflows via pixi-sandbox (plan, check, init, doctor, pack, restore).",
    marks: ["setup", "workflow"],
    requires: ["pixi-sandbox"],
    options: [
      {
        name: "action",
        type: "string",
        choices: ["plan", "check", "init", "doctor", "pack", "restore"],
        default: "plan",
        description: "pixi-sandbox subcommand to execute.",
      },
    ],
  },
  (ctx: ToolContext, args, positionals) => {
    const action = String(args.action ?? "plan");
    switch (action) {
      case "plan":
        ctx.run([
          "pixi-sandbox",
          "plan",
          "--config",
          "pixi-sandbox.toml",
          "--json",
          ...positionals,
        ]);
        break;
      case "check":
        ctx.run([
          "pixi-sandbox",
          "init",
          "--script-path",
          "scripts/restore.sh",
          "--check",
          ...positionals,
        ]);
        break;
      case "init":
        ctx.run(["pixi-sandbox", "init", "--script-path", "scripts/restore.sh", ...positionals]);
        break;
      default:
        ctx.run(["pixi-sandbox", action, ...positionals]);
        break;
    }
  },
);
