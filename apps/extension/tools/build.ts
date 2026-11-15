import { type ToolContext, tool } from "@archont561/tasknest";

export const build = tool(
  {
    name: "build",
    description: "Build or zip the WXT MV3 browser extension for Chrome, Firefox, or Safari.",
    marks: ["build", "release"],
    requires: ["bun"],
    options: [
      {
        name: "browser",
        type: "string",
        choices: ["chrome", "firefox", "safari"],
        default: "chrome",
        description: "Target browser.",
      },
      {
        name: "zip",
        type: "boolean",
        default: false,
        description: "Produce a store-ready zip archive (chrome or firefox).",
      },
    ],
  },
  (ctx: ToolContext, args) => {
    const browser = String(args.browser ?? "chrome");
    const shouldZip = args.zip === true;
    const prefix = shouldZip && browser !== "safari" ? "zip" : "build";
    const script = browser === "chrome" ? prefix : `${prefix}:${browser}`;
    ctx.run(["bun", "run", script]);
  },
);
