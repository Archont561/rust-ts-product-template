# Offline sandbox (orphan branch)

Built 2026-11-17T13:55:30Z from commit `5891f8a` for platform `linux-64`.
`pixi.lock` sha256 `3b1853a336fd972445512c57fdda52e9653eb5441e80c5ae6e491ab4a1ab9269`.

The verified self-bootstrap binary is stored at `.pixi-sandbox/tools/linux-64/pixi-sandbox`. The branch root intentionally contains documentation only.

| env | platform | packed | unpacked | files |
| --- | --- | ---: | ---: | ---: |
| `default` | linux-64 | 136.1 MiB | 422.2 MiB | 55 |
| `docs` | linux-64 | 133.1 MiB | 415.4 MiB | 56 |
| `full` | linux-64 | 543.9 MiB | 2050.5 MiB | 72 |
| `js` | linux-64 | 40.3 MiB | 119.8 MiB | 22 |
| `lint` | linux-64 | 133.0 MiB | 414.9 MiB | 54 |
| `rust` | linux-64 | 448.8 MiB | 1751.1 MiB | 39 |

Cargo dependencies: **61 crates**, 60.0 MiB (loose) from `Cargo.lock` sha256 `73eb283ddcf4…`; restore materialises them to `.pixi-sandbox/vendor/`. Built with cargo 1.99.1 (5f94df478 2026-08-27); rustc 1.99.1 (58cf8f9c3 2026-10-13).


## Restore on the disconnected machine

```bash
./.pixi-sandbox/tools/linux-64/pixi-sandbox doctor --branch-location . --verify
./.pixi-sandbox/tools/linux-64/pixi-sandbox restore --branch-location . --output-path <project> --force
# then, from <project> with no network, use pixi as the sole entrypoint:
pixi install --frozen --offline
pixi run --frozen -- cargo build --offline
```

Every manifest blob is verified before it is written into the working tree.
