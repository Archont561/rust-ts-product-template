import { type ToolContext, tool } from "@archont561/tasknest";

export const deny = tool(
  {
    name: "deny",
    description: "Run cargo-deny supply-chain checks (offline bans/licenses/sources by default).",
    marks: ["lint", "security"],
    requires: ["cargo-deny"],
    options: [
      {
        name: "online",
        type: "boolean",
        default: false,
        description: "Include online RustSec advisory checks (requires network).",
      },
    ],
  },
  (ctx: ToolContext, args) => {
    if (args.online) {
      ctx.run(["cargo", "deny", "check"]);
    } else {
      ctx.run(["cargo", "deny", "--offline", "check", "bans", "licenses", "sources"]);
    }
  },
);
