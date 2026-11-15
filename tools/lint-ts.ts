import { type ToolContext, tool } from "@archont561/tasknest";

export const lintTs = tool(
  {
    name: "lint-ts",
    description: "Run Biome formatting and boundary checks across TypeScript/Svelte/JSON files.",
    marks: ["lint", "fast"],
    requires: ["bun"],
    options: [
      {
        name: "fix",
        type: "boolean",
        default: false,
        description: "Apply safe Biome fixes in place.",
      },
    ],
  },
  (ctx: ToolContext, args) => {
    const argv = ["bun", "x", "--bun", "--no-install", "biome", "check"];
    if (args.fix) {
      argv.push("--write");
    }
    argv.push(".");
    ctx.run(argv);
  },
);
