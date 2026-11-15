import { type ToolContext, tool } from "@archont561/tasknest";

export const testRust = tool(
  {
    name: "test-rust",
    description: "Run Rust workspace tests with cargo-nextest.",
    marks: ["test", "rust"],
    requires: ["cargo-nextest"],
  },
  (ctx: ToolContext) => {
    ctx.run(["cargo", "nextest", "run", "--workspace"]);
  },
);
