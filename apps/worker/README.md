# `apps/worker`

Cloudflare Worker edge gateway (`workerd` / Wrangler) combining:

- **Cloudflare Edge Cache & KV (`CACHE_KV`):** Read-through caching for fast global edge responses.
- **Neon Postgres Client:** Serverless Neon SQL client (via `@neondatabase/serverless` or Cloudflare **Hyperdrive** pooling) behind an injectable `DatabaseClient` contract.
- **Shared Core via WASM & Packages:** Executes the same `rust/crates/services` validation via `@product/infrastructure-wasm` (`rust/adapters/wasm`) and `@product/application`, and forwards origin-only routes to `apps/web` via `@product/infrastructure-http`.

## Configuration

- Worker bindings, compatibility flags, KV namespaces, and Hyperdrive config live in [`wrangler.jsonc`](wrangler.jsonc).
- Local multi-service development (Worker + Axum Alpine binary + Postgres / Neon Local) runs via root [`docker-compose.yml`](../../docker-compose.yml) (`docker compose --profile local --profile edge up --build`).
- Scoped Tasknest tasks live in `apps/worker/tools/` (`worker dev`, `worker deploy`).
