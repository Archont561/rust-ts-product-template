import { type ToolContext, tool } from "@archont561/tasknest";

export const deploy = tool(
  {
    name: "deploy",
    description: "Deploy the Cloudflare Worker with Wrangler (apps/worker).",
    marks: ["release"],
    options: [
      {
        name: "env",
        type: "string",
        choices: ["staging", "production"],
        default: "staging",
        description: "Target Cloudflare Worker environment.",
      },
    ],
  },
  (ctx: ToolContext, args) => {
    const env = String(args.env ?? "staging");
    ctx.run(["bun", "run", "deploy", "--", "--env", env]);
  },
);
