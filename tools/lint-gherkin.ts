import { type ToolContext, tool } from "@archont561/tasknest";

export const lintGherkin = tool(
  {
    name: "lint-gherkin",
    description: "Lint Gherkin .feature specifications across rust/ and packages/.",
    marks: ["lint", "fast"],
    requires: ["gherlint"],
  },
  (ctx: ToolContext) => {
    ctx.run(["gherlint", "lint", "rust"]);
    ctx.run(["gherlint", "lint", "packages"]);
  },
);
