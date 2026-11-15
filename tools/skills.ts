import { type ToolContext, tool } from "@archont561/tasknest";

export const skills = tool(
  {
    name: "skills",
    description: "Manage coding-agent skills via the skills CLI (pass args after `-- --`).",
    marks: ["workflow"],
    requires: ["bun"],
  },
  (ctx: ToolContext, _args, positionals) => {
    ctx.run(["bun", "x", "--bun", "--no-install", "skills", ...positionals]);
  },
);
