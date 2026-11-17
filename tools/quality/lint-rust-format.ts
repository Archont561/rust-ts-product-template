import { type ToolContext, tool } from "@archont561/tasknest";

export const lintRustFormat = tool(
  {
    name: "lint-rust-format",
    description: "Verify rustfmt formatting across the Rust workspace without rewriting files.",
    marks: ["lint", "rust"],
    requires: ["cargo"],
  },
  (ctx: ToolContext) => {
    ctx.run(["cargo", "fmt", "--all", "--", "--check"]);
  },
);
