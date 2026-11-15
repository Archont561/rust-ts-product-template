import { type ToolContext, tool } from "@archont561/tasknest";

export const docker = tool(
  {
    name: "docker",
    description: "Build the static Alpine Linux binary image for apps/web.",
    marks: ["build", "release"],
    requires: ["docker"],
    options: [
      {
        name: "tag",
        type: "string",
        default: "product-web:local",
        description: "Docker image tag.",
      },
    ],
  },
  (ctx: ToolContext, args) => {
    const tag = String(args.tag ?? "product-web:local");
    ctx.run(["docker", "build", "-f", "Dockerfile", "-t", tag, "../.."]);
  },
);
