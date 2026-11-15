import type { ProductClient } from "@product/application";
import { type GreetingResponse, ServiceError } from "@product/contracts";
import type { HttpFetch } from "@product/infrastructure-http";
import type { DatabaseClient, EdgeCache, ExecutionContextLike } from "@/src/env";

export interface WorkerAppDeps {
  readonly client: ProductClient;
  readonly cache: EdgeCache;
  readonly db: DatabaseClient;
  readonly originUrl?: string | undefined;
  readonly originFetch?: HttpFetch | undefined;
  readonly cacheTtlSeconds?: number | undefined;
}

function jsonResponse(
  body: unknown,
  status = 200,
  extraHeaders?: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  });
}

/**
 * Construct a pure, injectable Cloudflare Worker HTTP handler.
 *
 * - `GET /api/hello?name=...` — Edge read-through cache (`X-Cache: HIT|MISS`)
 *   backed by the transport-independent `ProductClient` (WASM Rust core or memory).
 * - `GET /api/health` — Checks Neon/Postgres connectivity via `DatabaseClient`.
 * - `/api/origin/*` — Proxies origin-only endpoints to `apps/web` (`ORIGIN_URL`).
 */
export function createWorkerApp(deps: WorkerAppDeps) {
  const ttl = deps.cacheTtlSeconds ?? 60;
  const originUrl = deps.originUrl?.replace(/\/+$/, "");
  const originFetch: HttpFetch =
    deps.originFetch ?? ((input, init) => globalThis.fetch(input, init));

  return async function handle(request: Request, ctx?: ExecutionContextLike): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/api/hello") {
      const rawName = url.searchParams.get("name") ?? undefined;
      const cacheKey = `hello:${rawName ?? ""}`;

      const cached = await deps.cache.get<GreetingResponse>(cacheKey);
      if (cached !== null) {
        return jsonResponse(cached, 200, { "x-cache": "HIT" });
      }

      try {
        const result = await deps.client.greet({ name: rawName });
        const writePromise = deps.cache.set(cacheKey, result, ttl);
        if (ctx !== undefined) {
          ctx.waitUntil(writePromise);
        } else {
          await writePromise;
        }
        return jsonResponse(result, 200, {
          "x-cache": "MISS",
          "cache-control": `public, max-age=${ttl}`,
        });
      } catch (cause) {
        if (cause instanceof ServiceError) {
          const status = cause.code === "invalid_input" ? 400 : 503;
          return jsonResponse({ code: cause.code, message: cause.message }, status);
        }
        return jsonResponse({ code: "unavailable", message: String(cause) }, 503);
      }
    }

    if (request.method === "GET" && url.pathname === "/api/health") {
      const dbOk = await deps.db.ping();
      return jsonResponse(
        {
          status: dbOk ? "ok" : "degraded",
          runtime: "cloudflare-worker",
          transport: deps.client.transport.platform,
          database: dbOk ? "connected" : "unreachable",
        },
        dbOk ? 200 : 503,
      );
    }

    if (url.pathname.startsWith("/api/origin/")) {
      if (originUrl === undefined || originUrl.length === 0) {
        return jsonResponse({ code: "unavailable", message: "ORIGIN_URL is not configured" }, 503);
      }
      const upstreamPath = url.pathname.replace(/^\/api\/origin/, "/api");
      const upstreamUrl = `${originUrl}${upstreamPath}${url.search}`;
      try {
        return await originFetch(upstreamUrl, {
          method: request.method,
          headers: { accept: "application/json" },
        });
      } catch (cause) {
        return jsonResponse(
          {
            code: "disconnected",
            message: cause instanceof Error ? cause.message : String(cause),
          },
          502,
        );
      }
    }

    return jsonResponse({ code: "not_found", message: `No route for ${url.pathname}` }, 404);
  };
}
