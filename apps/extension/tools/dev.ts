import { type ToolContext, tool } from "@archont561/tasknest";

export const dev = tool(
  {
    name: "dev",
    description: "Run the WXT browser extension in dev mode (apps/extension).",
    marks: ["dev"],
    persistent: true,
    options: [
      {
        name: "browser",
        type: "string",
        choices: ["chrome", "firefox", "safari"],
        default: "chrome",
        description: "Target browser.",
      },
    ],
  },
  (ctx: ToolContext, args) => {
    const browser = String(args.browser ?? "chrome");
    const script = browser === "chrome" ? "dev" : `dev:${browser}`;
    ctx.run(["bun", "run", script]);
  },
);
