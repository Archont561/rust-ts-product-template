import { type ToolContext, tool } from "@archont561/tasknest";

export const packageSafari = tool(
  {
    name: "package-safari",
    description:
      "Build the Safari MV3 bundle with WXT and wrap it into an Xcode app via xcrun safari-web-extension-packager (macOS only).",
    marks: ["build", "release"],
    requires: ["xcrun"],
    options: [
      {
        name: "projectLocation",
        type: "string",
        default: ".output/safari-xcode",
        description: "Output directory for the generated Safari Xcode project.",
      },
    ],
  },
  (ctx: ToolContext, args) => {
    const outDir = String(args.projectLocation ?? ".output/safari-xcode");
    ctx.run(["bun", "run", "build:safari"]);
    ctx.run([
      "xcrun",
      "safari-web-extension-packager",
      ".output/safari-mv3",
      "--project-location",
      outDir,
      "--macos-only",
      "--no-open",
      "--force",
    ]);
  },
);
