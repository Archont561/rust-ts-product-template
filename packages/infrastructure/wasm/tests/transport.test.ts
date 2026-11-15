import { describe, expect, test } from "bun:test";
import { createWasmTransport } from "@/src/index";

describe("@product/infrastructure-wasm injectable transport", () => {
  test("lazy-loads and memoizes the injected WASM module", async () => {
    let loadCount = 0;
    const transport = createWasmTransport({
      load: async () => {
        loadCount += 1;
        return {
          dispatch(request) {
            return {
              status: "ok",
              data: {
                message: `Hello, ${request.name ?? "World"}!`,
                platform: "wasm",
                version: "0.1.0",
              },
            };
          },
        };
      },
    });

    const first = await transport.dispatch({ method: "hello", name: "One" });
    const second = await transport.dispatch({ method: "hello", name: "Two" });
    expect(loadCount).toBe(1);
    expect(first.status === "ok" && first.data.message).toBe("Hello, One!");
    expect(second.status === "ok" && second.data.message).toBe("Hello, Two!");
  });

  test("returns unavailable when WASM load fails and allows retry", async () => {
    let attempts = 0;
    const transport = createWasmTransport({
      load: async () => {
        attempts += 1;
        if (attempts === 1) {
          throw new Error("wasm instantiate failed");
        }
        return {
          dispatch: () => ({
            status: "ok",
            data: { message: "Hello, World!", platform: "wasm", version: "0.1.0" },
          }),
        };
      },
    });

    const failed = await transport.dispatch({ method: "hello" });
    expect(failed.status === "err" && failed.error.code).toBe("unavailable");

    const recovered = await transport.dispatch({ method: "hello" });
    expect(recovered.status === "ok" && recovered.data.message).toBe("Hello, World!");
  });
});
