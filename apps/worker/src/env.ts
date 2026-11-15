/** Minimal structural subset of Cloudflare Workers `KVNamespace` for zero-coupling tests. */
export interface KvNamespaceLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

/** Minimal structural subset of Cloudflare Workers `Hyperdrive`. */
export interface HyperdriveLike {
  readonly connectionString: string;
}

/** Minimal structural subset of Cloudflare Workers `ExecutionContext`. */
export interface ExecutionContextLike {
  waitUntil(promise: Promise<unknown>): void;
}

/** Typed Cloudflare Worker environment matching `wrangler.jsonc`. */
export interface WorkerEnv {
  readonly ENVIRONMENT?: string | undefined;
  readonly ORIGIN_URL?: string | undefined;
  readonly CACHE_TTL_SECONDS?: string | undefined;
  readonly DATABASE_URL?: string | undefined;
  readonly CACHE_KV?: KvNamespaceLike | undefined;
  readonly HYPERDRIVE?: HyperdriveLike | undefined;
}

/** Injectable edge cache capability (backed by Cloudflare KV / Cache API or memory). */
export interface EdgeCache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
}

/** Injectable Neon/Postgres health & SQL capability. */
export interface DatabaseClient {
  ping(): Promise<boolean>;
}
