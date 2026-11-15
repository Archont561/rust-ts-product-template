import { createProductClient } from "@product/application";
import { createMemoryTransport } from "@product/infrastructure-memory";
import { createWasmTransport } from "@product/infrastructure-wasm";
import { createKvCache, createMemoryCache, createNeonDatabase } from "@/src/adapters";
import { createWorkerApp } from "@/src/app";
import type { ExecutionContextLike, WorkerEnv } from "@/src/env";

const fallbackMemoryCache = createMemoryCache();

/**
 * Thin Cloudflare Worker entrypoint wiring Wrangler bindings (`CACHE_KV`,
 * Neon `DATABASE_URL` / `HYPERDRIVE`, `ORIGIN_URL`) into `createWorkerApp`.
 *
 * Swap `createMemoryTransport` for the compiled `rust/adapters/wasm` module
 * inside `createWasmTransport({ load })` once the WASM bundle is built.
 */
export default {
  async fetch(request: Request, env: WorkerEnv, ctx: ExecutionContextLike): Promise<Response> {
    const cache = env.CACHE_KV !== undefined ? createKvCache(env.CACHE_KV) : fallbackMemoryCache;
    const ttl = Number.parseInt(env.CACHE_TTL_SECONDS ?? "60", 10);

    const fallbackTransport = createMemoryTransport({ platform: "cloudflare-worker-wasm" });
    const transport = createWasmTransport({
      platform: "cloudflare-worker-wasm",
      load: async () => fallbackTransport,
    });

    const dbConnection = env.HYPERDRIVE?.connectionString ?? env.DATABASE_URL;
    const db = createNeonDatabase(async () => (dbConnection ? [{ ok: 1 }] : []));

    const handle = createWorkerApp({
      client: createProductClient(transport),
      cache,
      db,
      originUrl: env.ORIGIN_URL,
      cacheTtlSeconds: Number.isFinite(ttl) ? ttl : 60,
    });

    return handle(request, ctx);
  },
};
