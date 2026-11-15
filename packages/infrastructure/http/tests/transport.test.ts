import { describe, expect, test } from "bun:test";
import { createHttpTransport, type HttpFetch } from "@/src/index";

describe("@product/infrastructure-http injectable transport", () => {
  test("dispatches GET /api/hello through an injected fetch double", async () => {
    let seenUrl = "";
    const fakeFetch: HttpFetch = async (input) => {
      seenUrl = input;
      return new Response(
        JSON.stringify({ message: "Hello, HTTP!", platform: "web-axum", version: "0.1.0" }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    };

    const transport = createHttpTransport({
      baseUrl: "https://api.example.com/",
      fetch: fakeFetch,
    });
    const res = await transport.dispatch({ method: "hello", name: "HTTP" });

    expect(seenUrl).toBe("https://api.example.com/api/hello?name=HTTP");
    expect(res).toEqual({
      status: "ok",
      data: { message: "Hello, HTTP!", platform: "web-axum", version: "0.1.0" },
    });
  });

  test("maps HTTP 400, network failure, and malformed payloads to structured errors", async () => {
    const badInput = createHttpTransport({
      baseUrl: "https://api.example.com",
      fetch: async () =>
        new Response(JSON.stringify({ code: "invalid_input", message: "bad name" }), {
          status: 400,
        }),
    });
    const r400 = await badInput.dispatch({ method: "hello", name: "bad" });
    expect(r400.status === "err" && r400.error.code).toBe("invalid_input");

    const networkDown = createHttpTransport({
      baseUrl: "https://api.example.com",
      fetch: async () => {
        throw new Error("connection refused");
      },
    });
    const rDown = await networkDown.dispatch({ method: "hello" });
    expect(rDown.status === "err" && rDown.error.code).toBe("disconnected");

    const badPayload = createHttpTransport({
      baseUrl: "https://api.example.com",
      fetch: async () => new Response(JSON.stringify({ unexpected: true }), { status: 200 }),
    });
    const rBad = await badPayload.dispatch({ method: "hello" });
    expect(rBad.status === "err" && rBad.error.code).toBe("unavailable");
  });
});
