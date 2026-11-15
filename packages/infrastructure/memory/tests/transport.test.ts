import { describe, expect, test } from "bun:test";
import { createMemoryTransport } from "@/src/index";

describe("@product/infrastructure-memory transport", () => {
  test("greets deterministically with Rust-equivalent validation", async () => {
    const transport = createMemoryTransport({ platform: "test-mem" });
    const defaultRes = await transport.dispatch({ method: "hello" });
    expect(defaultRes).toEqual({
      status: "ok",
      data: { message: "Hello, World!", platform: "test-mem", version: "0.1.0" },
    });

    const trimmed = await transport.dispatch({ method: "hello", name: "  Ada  " });
    expect(trimmed.status === "ok" && trimmed.data.message).toBe("Hello, Ada!");

    const invalid = await transport.dispatch({ method: "hello", name: "Ada\nLovelace" });
    expect(invalid.status === "err" && invalid.error.code).toBe("invalid_input");

    const tooLong = await transport.dispatch({ method: "hello", name: "a".repeat(65) });
    expect(tooLong.status === "err" && tooLong.error.code).toBe("invalid_input");
  });

  test("reports disconnected error when configured disconnected", async () => {
    const offline = createMemoryTransport({ connected: false });
    expect(offline.connected).toBe(false);
    const res = await offline.dispatch({ method: "hello" });
    expect(res.status === "err" && res.error.code).toBe("disconnected");
  });
});
