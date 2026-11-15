import { describe, expect, it } from "bun:test";
import { existsSync } from "node:fs";
import { join } from "node:path";
import pkg from "@/package.json" with { type: "json" };
import { resolvePackageDir, VERSION } from "@/src/index";

describe("@product/build-utils", () => {
  it("exports the version from package.json", () => {
    expect(VERSION).toBe(pkg.version);
    expect(VERSION.length).toBeGreaterThan(0);
  });

  it("resolves its own package directory relative to caller import.meta.url", () => {
    const dir = resolvePackageDir("@product/build-utils", import.meta.url);
    expect(existsSync(join(dir, "package.json"))).toBe(true);
  });
});
