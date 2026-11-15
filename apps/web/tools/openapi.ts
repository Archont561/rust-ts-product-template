import { type ToolContext, tool } from "@archont561/tasknest";

export const openapi = tool(
  {
    name: "openapi",
    description: "Emit the typed OpenAPI JSON spec from the Axum server (apps/web).",
    marks: ["codegen"],
    requires: ["cargo"],
  },
  (ctx: ToolContext) => {
    ctx.run(["cargo", "run", "--", "--emit-openapi"]);
  },
);
