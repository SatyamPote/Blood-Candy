# Container-first blood-candy workflows

This repo already had **container detection** in the Rust runtime before this document was added:

- `rust/crates/runtime/src/sandbox.rs` detects Docker/Podman/container markers such as `/.dockerenv`, `/run/.containerenv`, matching env vars, and `/proc/1/cgroup` hints.
- `rust/crates/blood-candy-cli/src/main.rs` exposes that state through the `bloodcandy sandbox` / `cargo run -p blood-candy-cli -- sandbox` report.
- `.github/workflows/rust-ci.yml` runs on `ubuntu-latest`, but it does **not** define a Docker or Podman container job.
- Before this change, the repo did **not** have a checked-in `Dockerfile`, `Containerfile`, or `.devcontainer/` config.

This document adds a small checked-in `Containerfile` so Docker and Podman users have one canonical container workflow.

## What the checked-in container image is for

The root [`../Containerfile`](../Containerfile) gives you a reusable Rust build/test shell with the extra packages this workspace commonly needs (`git`, `pkg-config`, `libssl-dev`, certificates).

It does **not** copy the repository into the image. Instead, the recommended flow is to bind-mount your checkout into `/workspace` so edits stay on the host.

## Build the image

From the repository root:

### Docker

```bash
docker build -t blood-candy-dev -f Containerfile .
```

### Podman

```bash
podman build -t blood-candy-dev -f Containerfile .
```

## Run `cargo test --workspace` in the container

These commands mount the repo, keep Cargo build artifacts out of the working tree, and run from the Rust workspace at `rust/`.

### Docker

```bash
docker run --rm -it \
  -v "$PWD":/workspace \
  -e CARGO_TARGET_DIR=/tmp/bloodcandy-target \
  -w /workspace/rust \
  blood-candy-dev \
  cargo test --workspace
```

### Podman

```bash
podman run --rm -it \
  -v "$PWD":/workspace:Z \
  -e CARGO_TARGET_DIR=/tmp/bloodcandy-target \
  -w /workspace/rust \
  blood-candy-dev \
  cargo test --workspace
```

If you want a fully clean rebuild, add `cargo clean &&` before `cargo test --workspace`.

## Open a shell in the container

### Docker

```bash
docker run --rm -it \
  -v "$PWD":/workspace \
  -e CARGO_TARGET_DIR=/tmp/bloodcandy-target \
  -w /workspace/rust \
  blood-candy-dev
```

### Podman

```bash
podman run --rm -it \
  -v "$PWD":/workspace:Z \
  -e CARGO_TARGET_DIR=/tmp/bloodcandy-target \
  -w /workspace/rust \
  blood-candy-dev
```

Inside the shell:

```bash
cargo build --workspace
cargo test --workspace
cargo run -p blood-candy-cli -- --help
cargo run -p blood-candy-cli -- sandbox
```

The `sandbox` command is a useful sanity check: inside Docker or Podman it should report `In container true` and list the markers the runtime detected.

## Bind-mount this repo and another repo at the same time

If you want to run `bloodcandy` against a second checkout while keeping `blood-candy` itself mounted read-write:

### Docker

```bash
docker run --rm -it \
  -v "$PWD":/workspace \
  -v "$HOME/src/other-repo":/repo \
  -e CARGO_TARGET_DIR=/tmp/bloodcandy-target \
  -w /workspace/rust \
  blood-candy-dev
```

### Podman

```bash
podman run --rm -it \
  -v "$PWD":/workspace:Z \
  -v "$HOME/src/other-repo":/repo:Z \
  -e CARGO_TARGET_DIR=/tmp/bloodcandy-target \
  -w /workspace/rust \
  blood-candy-dev
```

Then, for example:

```bash
cargo run -p blood-candy-cli -- prompt "summarize /repo"
```

## Notes

- Docker and Podman use the same checked-in `Containerfile`.
- The `:Z` suffix in the Podman examples is for SELinux relabeling; keep it on Fedora/RHEL-class hosts.
- Running with `CARGO_TARGET_DIR=/tmp/bloodcandy-target` avoids leaving container-owned `target/` artifacts in your bind-mounted checkout.
- For non-container local development, keep using [`../USAGE.md`](../USAGE.md) and [`../rust/README.md`](../rust/README.md).
