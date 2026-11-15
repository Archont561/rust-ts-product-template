import type { DatabaseClient, EdgeCache, KvNamespaceLike } from "@/src/env";

/** Wrap a Cloudflare `KVNamespace` binding into the injectable `EdgeCache` contract. */
export function createKvCache(kv: KvNamespaceLike): EdgeCache {
  return {
    async get<T>(key: string): Promise<T | null> {
      const raw = await kv.get(key);
      if (raw === null) {
        return null;
      }
      try {
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    },
    async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
      await kv.put(key, JSON.stringify(value), { expirationTtl: ttlSeconds });
    },
  };
}

/** Deterministic in-memory `EdgeCache` for Bun unit tests and local preview fallback. */
export function createMemoryCache(): EdgeCache {
  const store = new Map<string, { value: string; expiresAt: number }>();

  return {
    async get<T>(key: string): Promise<T | null> {
      const entry = store.get(key);
      if (entry === undefined) {
        return null;
      }
      if (Date.now() > entry.expiresAt) {
        store.delete(key);
        return null;
      }
      return JSON.parse(entry.value) as T;
    },
    async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
      store.set(key, {
        value: JSON.stringify(value),
        expiresAt: Date.now() + ttlSeconds * 1000,
      });
    },
  };
}

/** Minimal injectable SQL runner satisfied by `@neondatabase/serverless` `neon(url)` or a test fake. */
export type SqlQueryFn = (sql: string) => Promise<readonly unknown[]>;

/** Wrap an injectable Neon serverless / Hyperdrive query runner into `DatabaseClient`. */
export function createNeonDatabase(query: SqlQueryFn): DatabaseClient {
  return {
    async ping(): Promise<boolean> {
      try {
        const rows = await query("SELECT 1 AS ok");
        return rows.length > 0;
      } catch {
        return false;
      }
    },
  };
}
