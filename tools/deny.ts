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
      // The offline Linux sandbox only ships Linux-target sources; the online security lane
      // retains the full target matrix from deny.toml.
      ctx.run([
        "cargo",
        "deny",
        "--offline",
        "--target",
        "x86_64-unknown-linux-gnu",
        "check",
        "bans",
        "licenses",
        "sources",
      ]);
    }
  },
);
