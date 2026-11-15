import { describe, expect, test } from "bun:test";
import { isGreetingResponse, isServiceResponse, ServiceError } from "@/src/index";

describe("@product/contracts guards & errors", () => {
  test("validates GreetingResponse payloads at runtime boundaries", () => {
    expect(
      isGreetingResponse({ message: "Hello, World!", platform: "memory", version: "0.1.0" }),
    ).toBe(true);
    expect(isGreetingResponse(null)).toBe(false);
    expect(isGreetingResponse({ message: 123 })).toBe(false);
  });

  test("validates single-door ServiceResponse envelopes", () => {
    expect(
      isServiceResponse({
        status: "ok",
        data: { message: "Hello, World!", platform: "memory", version: "0.1.0" },
      }),
    ).toBe(true);
    expect(
      isServiceResponse({
        status: "err",
        error: { code: "invalid_input", message: "bad name" },
      }),
    ).toBe(true);
    expect(isServiceResponse({ status: "err", error: { code: "unknown", message: "x" } })).toBe(
      false,
    );
    expect(isServiceResponse("not-an-object")).toBe(false);
  });

  test("constructs typed ServiceError with optional field", () => {
    const err = new ServiceError("invalid_input", "too long", "name");
    expect(err.name).toBe("ServiceError");
    expect(err.code).toBe("invalid_input");
    expect(err.field).toBe("name");
    expect(err.message).toBe("too long");
  });
});
