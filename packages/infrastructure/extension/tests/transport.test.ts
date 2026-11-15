import { describe, expect, test } from "bun:test";
import { createExtensionTransport } from "@/src/index";

describe("@product/infrastructure-extension injectable transport", () => {
  test("validates responses across the untrusted MV3 messaging boundary", async () => {
    const transport = createExtensionTransport({
      sendMessage: async (msg) => {
        const req = msg as { method: string; name?: string };
        return {
          status: "ok",
          data: {
            message: `Hello, ${req.name ?? "World"}!`,
            platform: "extension-mv3",
            version: "0.1.0",
          },
        };
      },
    });

    const ok = await transport.dispatch({ method: "hello", name: "MV3" });
    expect(ok.status === "ok" && ok.data.message).toBe("Hello, MV3!");

    const invalid = createExtensionTransport({
      sendMessage: async () => ({ untrusted: "garbage" }),
    });
    const rBad = await invalid.dispatch({ method: "hello" });
    expect(rBad.status === "err" && rBad.error.code).toBe("unavailable");

    const closed = createExtensionTransport({
      sendMessage: async () => {
        throw new Error("Could not establish connection. Receiving end does not exist.");
      },
    });
    const rClosed = await closed.dispatch({ method: "hello" });
    expect(rClosed.status === "err" && rClosed.error.code).toBe("disconnected");
  });
});
