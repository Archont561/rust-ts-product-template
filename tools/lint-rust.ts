import { type ToolContext, tool } from "@archont561/tasknest";

export const lintRust = tool(
  {
    name: "lint-rust",
    description: "Run cargo clippy across the Rust workspace with -D warnings.",
    marks: ["lint", "rust"],
    requires: ["cargo"],
  },
  (ctx: ToolContext) => {
    ctx.run(["cargo", "clippy", "--workspace", "--all-targets", "--", "-D", "warnings"]);
  },
);
