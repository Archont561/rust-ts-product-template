import { type ToolContext, tool } from "@archont561/tasknest";

export const hello = tool(
  {
    name: "hello",
    description: "Verify the Tasknest TypeScript runner works in this monorepo.",
    marks: ["fast", "offline"],
    options: [
      {
        name: "name",
        type: "string",
        default: "monorepo",
        description: "Name to greet.",
      },
    ],
  },
  (ctx: ToolContext, args) => {
    const target = String(args.name ?? "monorepo");
    process.stdout.write(`Hello, ${target}! (root: ${ctx.repoRoot})\n`);
  },
);
