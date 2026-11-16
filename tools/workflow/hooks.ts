import { type ToolContext, tool } from "@archont561/tasknest";

export const hooks = tool(
  {
    name: "hooks",
    description: "Install, uninstall, validate, or run Lefthook Git hooks (pre-commit / pre-push).",
    marks: ["setup", "workflow"],
    requires: ["lefthook"],
    options: [
      {
        name: "action",
        type: "string",
        choices: ["install", "uninstall", "validate", "run"],
        default: "install",
        description: "Lefthook action to execute.",
      },
      {
        name: "hook",
        type: "string",
        choices: ["pre-commit", "pre-push"],
        default: "pre-commit",
        description: "Hook name used when `--action run` is selected.",
      },
    ],
  },
  (ctx: ToolContext, args, positionals) => {
    const action = String(args.action ?? "install");
    if (action === "run") {
      const hook = String(args.hook ?? "pre-commit");
      ctx.run(["lefthook", "run", hook, ...positionals]);
      return;
    }
    ctx.run(["lefthook", action, ...positionals]);
  },
);
