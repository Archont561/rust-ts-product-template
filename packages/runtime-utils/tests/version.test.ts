import { describe, expect, it } from "bun:test";
import pkg from "@/package.json" with { type: "json" };
import { assertNever, VERSION } from "@/src/index";

describe("@product/runtime-utils", () => {
  it("exports the version from package.json", () => {
    expect(VERSION).toBe(pkg.version);
    expect(VERSION.length).toBeGreaterThan(0);
  });

  it("throws a descriptive error when assertNever is reached at runtime", () => {
    expect(() => assertNever("unexpected" as never, "status")).toThrow(
      "status: Unexpected value: unexpected",
    );
  });
});
