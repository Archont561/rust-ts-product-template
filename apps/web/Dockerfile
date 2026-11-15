# syntax=docker/dockerfile:1
#
# Multi-stage Alpine build producing a pure statically linked Rust binary.
# Build from the monorepo root so relative path dependencies in `rust/` resolve:
#
#   docker build -f apps/web/Dockerfile -t product-web:local .
#   docker run --rm -p 8080:8080 product-web:local

FROM rust:1-alpine AS builder

RUN apk add --no-cache musl-dev

WORKDIR /work

# Preserve workspace-relative layout required by `apps/web/Cargo.toml`
COPY Cargo.toml Cargo.lock ./
COPY rust/ ./rust/
COPY apps/web/ ./apps/web/

WORKDIR /work/apps/web

# Build a fully static musl binary (no dynamic libc/libgcc dependencies).
ENV RUSTFLAGS="-C target-feature=+crt-static"
RUN cargo build --release

# ---------------------------------------------------------------------------
# Minimal Alpine Linux runtime image containing only the pure binary
# ---------------------------------------------------------------------------
FROM alpine:3.21 AS runtime

RUN apk add --no-cache ca-certificates \
  && adduser -D -H -u 10001 app

COPY --from=builder /work/apps/web/target/release/product-web /usr/local/bin/product-web

USER app
ENV BIND_ADDR=0.0.0.0:8080
EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/product-web"]
