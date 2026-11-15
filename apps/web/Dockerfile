# syntax=docker/dockerfile:1
#
# Build from the monorepo root so relative path dependencies in `rust/` resolve:
#
#   docker build -f apps/web/Dockerfile -t product-web:local .
#   docker run --rm -p 8080:8080 product-web:local

# Proc macros must be built for the host (glibc); cross-compile the application
# for musl so the resulting static binary runs in the minimal Alpine image.
FROM rust:1-bookworm AS builder

RUN apt-get update \
  && apt-get install -y --no-install-recommends musl-tools \
  && rm -rf /var/lib/apt/lists/*
RUN rustup target add x86_64-unknown-linux-musl

WORKDIR /work

# Preserve workspace-relative layout required by the Cargo manifests.
COPY Cargo.toml Cargo.lock ./
COPY rust/ ./rust/
COPY apps/web/ ./apps/web/

ENV CARGO_TARGET_X86_64_UNKNOWN_LINUX_MUSL_LINKER=musl-gcc

RUN cargo build --manifest-path apps/web/Cargo.toml --release --target x86_64-unknown-linux-musl

# ---------------------------------------------------------------------------
# Minimal Alpine Linux runtime image containing only the pure binary
# ---------------------------------------------------------------------------
FROM alpine:3.21 AS runtime

RUN apk add --no-cache ca-certificates \
  && adduser -D -H -u 10001 app

COPY --from=builder /work/target/x86_64-unknown-linux-musl/release/product-web /usr/local/bin/product-web

USER app
ENV BIND_ADDR=0.0.0.0:8080
EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/product-web"]
