import { type ToolContext, tool } from "@archont561/tasknest";

export const audit = tool(
  {
    name: "audit",
    description: "Audit Cargo.lock against the RustSec Advisory Database with cargo-audit.",
    marks: ["security"],
    requires: ["cargo-audit"],
  },
  (ctx: ToolContext) => {
    ctx.run(["cargo", "audit"]);
  },
);
