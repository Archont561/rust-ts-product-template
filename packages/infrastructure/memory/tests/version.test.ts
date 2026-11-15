import { describe, expect, it } from "bun:test";
import pkg from "@/package.json" with { type: "json" };
import { VERSION } from "@/src/index";

describe("@product/infrastructure-memory version", () => {
  it("exports the version from package.json", () => {
    expect(VERSION).toBe(pkg.version);
    expect(VERSION.length).toBeGreaterThan(0);
  });
});
