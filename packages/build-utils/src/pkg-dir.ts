import { createRequire } from "node:module";
import { dirname } from "node:path";

/**
 * Resolve the absolute root directory of a workspace or installed package
 * relative to the calling module (`import.meta.url`).
 *
 * Requires the target package to export `"./package.json": "./package.json"`.
 */
export function resolvePackageDir(specifier: string, fromUrl: string | URL): string {
  const requireFromCaller = createRequire(fromUrl);
  return dirname(requireFromCaller.resolve(`${specifier}/package.json`));
}
