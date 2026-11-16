import { type ToolContext, tool } from "@archont561/tasknest";

export const backlog = tool(
  {
    name: "backlog",
    description: "Run offline Backlog.md CLI commands (pass subcommands/flags after `-- --`).",
    marks: ["workflow"],
    requires: ["bun"],
  },
  (ctx: ToolContext, _args, positionals) => {
    ctx.run(["bun", "x", "--bun", "--no-install", "backlog", ...positionals]);
  },
);
