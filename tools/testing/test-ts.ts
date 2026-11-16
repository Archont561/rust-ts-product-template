import { type ToolContext, tool } from "@archont561/tasknest";

export const testTs = tool(
  {
    name: "test-ts",
    description: "Run Bun workspace unit tests (with optional LCOV coverage).",
    marks: ["test", "fast"],
    requires: ["bun"],
    options: [
      {
        name: "coverage",
        type: "boolean",
        default: false,
        description: "Emit coverage report into coverage/ts/.",
      },
    ],
  },
  (ctx: ToolContext, args) => {
    const argv = ["bun", "test"];
    if (args.coverage) {
      argv.push("--coverage");
    }
    ctx.run(argv);
  },
);
