import { describe, expect, test } from "bun:test";
import { createProductClient } from "@product/application";
import { createMemoryTransport } from "@product/infrastructure-memory";
import { createWasmTransport } from "@product/infrastructure-wasm";
import { createKvCache, createMemoryCache, createNeonDatabase } from "@/src/adapters";
import { createWorkerApp } from "@/src/app";

describe("@product/app-worker injectable Cloudflare Worker", () => {
  test("serves /api/hello via WASM transport with edge cache MISS then HIT", async () => {
    let dispatches = 0;
    const backing = createMemoryTransport({ platform: "cloudflare-worker-wasm" });
    const transport = createWasmTransport({
      platform: "cloudflare-worker-wasm",
      load: async () => ({
        dispatch(req) {
          dispatches += 1;
          return backing.dispatch(req);
        },
      }),
    });

    const kvBacking = new Map<string, string>();
    const cache = createKvCache({
      async get(key) {
        return kvBacking.get(key) ?? null;
      },
      async put(key, value) {
        kvBacking.set(key, value);
      },
    });

    const handle = createWorkerApp({
      client: createProductClient(transport),
      cache,
      db: createNeonDatabase(async () => [{ ok: 1 }]),
      cacheTtlSeconds: 120,
    });

    const first = await handle(new Request("https://edge.example.com/api/hello?name=Edge"));
    expect(first.status).toBe(200);
    expect(first.headers.get("x-cache")).toBe("MISS");
    expect(await first.json()).toEqual({
      message: "Hello, Edge!",
      platform: "cloudflare-worker-wasm",
      version: "0.1.0",
    });

    const second = await handle(new Request("https://edge.example.com/api/hello?name=Edge"));
    expect(second.status).toBe(200);
    expect(second.headers.get("x-cache")).toBe("HIT");
    expect(dispatches).toBe(1);
  });

  test("returns HTTP 400 for invalid names from shared validation", async () => {
    const handle = createWorkerApp({
      client: createProductClient(createMemoryTransport({ platform: "cloudflare-worker-wasm" })),
      cache: createMemoryCache(),
      db: createNeonDatabase(async () => [{ ok: 1 }]),
    });

    const res = await handle(new Request("https://edge.example.com/api/hello?name=bad%0Aname"));
    expect(res.status).toBe(400);
    const body = (await res.json()) as { code: string };
    expect(body.code).toBe("invalid_input");
  });

  test("reports /api/health based on injectable Neon database ping", async () => {
    const client = createProductClient(
      createMemoryTransport({ platform: "cloudflare-worker-wasm" }),
    );

    const healthy = createWorkerApp({
      client,
      cache: createMemoryCache(),
      db: createNeonDatabase(async () => [{ ok: 1 }]),
    });
    const okRes = await healthy(new Request("https://edge.example.com/api/health"));
    expect(okRes.status).toBe(200);
    expect((await okRes.json()) as Record<string, unknown>).toMatchObject({
      status: "ok",
      database: "connected",
    });

    const degraded = createWorkerApp({
      client,
      cache: createMemoryCache(),
      db: createNeonDatabase(async () => {
        throw new Error("neon connection failed");
      }),
    });
    const errRes = await degraded(new Request("https://edge.example.com/api/health"));
    expect(errRes.status).toBe(503);
    expect((await errRes.json()) as Record<string, unknown>).toMatchObject({
      status: "degraded",
      database: "unreachable",
    });
  });

  test("proxies /api/origin/* to apps/web via injectable originFetch", async () => {
    let forwardedUrl = "";
    const handle = createWorkerApp({
      client: createProductClient(createMemoryTransport()),
      cache: createMemoryCache(),
      db: createNeonDatabase(async () => [{ ok: 1 }]),
      originUrl: "http://web:8080/",
      originFetch: async (url) => {
        forwardedUrl = url;
        return new Response(JSON.stringify({ message: "Hello, Origin!" }), { status: 200 });
      },
    });

    const res = await handle(new Request("https://edge.example.com/api/origin/hello?name=Origin"));
    expect(forwardedUrl).toBe("http://web:8080/api/hello?name=Origin");
    expect(res.status).toBe(200);
  });
});
