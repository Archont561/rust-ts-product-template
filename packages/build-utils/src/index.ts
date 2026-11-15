import { version } from "@/package.json" with { type: "json" };

export { resolvePackageDir } from "@/src/pkg-dir";

export const VERSION: string = version;
