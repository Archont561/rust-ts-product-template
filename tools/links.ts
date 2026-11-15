import { type ToolContext, tool } from "@archont561/tasknest";

export const links = tool(
  {
    name: "links",
    description: "Check Markdown, MDX, and HTML links with lychee (offline by default).",
    marks: ["lint", "fast"],
    requires: ["lychee"],
    options: [
      {
        name: "online",
        type: "boolean",
        default: false,
        description: "Also check remote HTTP/HTTPS URLs (requires network).",
      },
    ],
  },
  (ctx: ToolContext, args) => {
    const argv = ["lychee", "--config", "lychee.toml"];
    if (!args.online) {
      argv.push("--offline");
    }
    argv.push(".");
    ctx.run(argv);
  },
);
