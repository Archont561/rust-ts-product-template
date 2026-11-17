import { type ToolContext, tool } from "@archont561/tasknest";

export const lintToml = tool(
  {
    name: "lint-toml",
    description:
      "Verify TOML formatting against .taplo.toml with taplo (--fix to rewrite in place).",
    marks: ["lint", "fast"],
    requires: ["taplo"],
    options: [
      {
        name: "fix",
        type: "boolean",
        default: false,
        description: "Rewrite TOML files in place instead of only checking them.",
      },
    ],
  },
  (ctx: ToolContext, args) => {
    const argv = ["taplo", "fmt"];
    if (!args.fix) {
      argv.push("--check");
    }
    ctx.run(argv);
  },
);
