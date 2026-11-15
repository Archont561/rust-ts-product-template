import { describe, expect, test } from "bun:test";
import { ServiceError, type ServiceTransport } from "@product/contracts";
import { createProductClient } from "@/src/index";

describe("@product/application ProductClient", () => {
  test("delegates greet through any injected transport", async () => {
    const transport: ServiceTransport = {
      platform: "fake",
      connected: true,
      async dispatch(request) {
        return {
          status: "ok",
          data: {
            message: `Hello, ${request.name ?? "World"}!`,
            platform: "fake",
            version: "0.1.0",
          },
        };
      },
    };

    const client = createProductClient(transport);
    expect(client.transport.platform).toBe("fake");
    const response = await client.greet({ name: "Architecture" });
    expect(response.message).toBe("Hello, Architecture!");
  });

  test("throws typed ServiceError when transport returns an error envelope", async () => {
    const failingTransport: ServiceTransport = {
      platform: "fake",
      connected: false,
      async dispatch() {
        return {
          status: "err",
          error: { code: "invalid_input", field: "name", message: "bad name" },
        };
      },
    };

    const client = createProductClient(failingTransport);
    await expect(client.greet({ name: "x" })).rejects.toThrow(ServiceError);
    try {
      await client.greet({ name: "x" });
    } catch (cause) {
      expect(cause).toBeInstanceOf(ServiceError);
      const err = cause as ServiceError;
      expect(err.code).toBe("invalid_input");
      expect(err.field).toBe("name");
    }
  });
});
