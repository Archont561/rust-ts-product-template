import { type ToolContext, tool } from "@archont561/tasknest";

export const lintMd = tool(
  {
    name: "lint-md",
    description: "Lint and optionally auto-fix Markdown and MDX files with rumdl.",
    marks: ["lint", "docs", "fast"],
    requires: ["rumdl"],
    options: [
      {
        name: "fix",
        type: "boolean",
        default: false,
        description: "Apply automatic rumdl fixes in place.",
      },
    ],
  },
  (ctx: ToolContext, args) => {
    const argv = ["rumdl", "check", "--deny-config-warnings"];
    if (args.fix) {
      argv.push("--fix");
    }
    argv.push(".");
    ctx.run(argv);
  },
);
