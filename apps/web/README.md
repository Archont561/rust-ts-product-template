# `apps/web`

Pure-Rust **Axum** HTTP/WebSocket API server crate, packaged as a statically linked binary in a minimal **Alpine Linux** container (`Dockerfile`).

## Responsibilities

- Exposes typed HTTP routes and OpenAPI 3.1 schema via `utoipa` (`GET /api/hello`, `GET /api/openapi.json`, `--emit-openapi`) backed by `rust/adapters/axum` and `rust/crates/*`.
- Owns process lifecycle, environment configuration (`BIND_ADDR`), TLS/reverse-proxy integration, structured logging, and container packaging (`apps/web/Dockerfile`).
- Contains zero frontend/Node/JS build assets (no `package.json` or SvelteKit bundle).

## Container Build

Build from the monorepo root so workspace path dependencies in `rust/` resolve cleanly:

```bash
docker build -f apps/web/Dockerfile -t product-web:local .
docker run --rm -p 8080:8080 product-web:local
```

## Notes

- Scoped Tasknest tasks live in `apps/web/tools/` (`web dev`, `web openapi`, `web docker`).
- OpenAPI output (`tasknest run web openapi`) feeds `@hey-api/openapi-ts` (`packages/contracts`) and `apps/docs` (`fumadocs-openapi`).
