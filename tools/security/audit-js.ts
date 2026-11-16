import { type ToolContext, tool } from "@archont561/tasknest";

export const auditJs = tool(
  {
    name: "audit-js",
    description: "Audit Bun workspace dependencies for security advisories with `bun audit`.",
    marks: ["security"],
    requires: ["bun"],
    options: [
      {
        name: "level",
        type: "string",
        choices: ["low", "moderate", "high", "critical"],
        default: "high",
        description: "Minimum severity threshold that fails the audit.",
      },
    ],
  },
  (ctx: ToolContext, args) => {
    const level = String(args.level ?? "high");
    ctx.run(["bun", "audit", `--audit-level=${level}`]);
  },
);
