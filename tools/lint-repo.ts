import { type ToolContext, tool } from "@archont561/tasknest";

export const lintRepo = tool(
  {
    name: "lint-repo",
    description: "Check repository structure, schemas, and architectural boundaries with alint.",
    marks: ["lint", "fast"],
    requires: ["alint"],
    options: [
      {
        name: "fix",
        type: "boolean",
        default: false,
        description: "Apply mechanical alint fixes.",
      },
    ],
  },
  (ctx: ToolContext, args) => {
    ctx.run(["alint", args.fix ? "fix" : "check"]);
  },
);
