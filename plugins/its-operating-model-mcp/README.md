# ITS Operating Model MCP

This plugin manages a local clone of the ITS Operating Model repository and serves authoritative documents through MCP.

## Requirements

The following tools must be installed before using this plugin:

- **[Bun](https://bun.sh)** (v1.0+) — used as the JavaScript runtime and package manager.
  - **macOS / Linux**: `curl -fsSL https://bun.sh/install | bash`
  - **Windows**: `powershell -c "irm bun.sh/install.ps1 | iex"` (requires PowerShell 5+)
- **[Git](https://git-scm.com/downloads)** (v2.20+) — required for cloning and updating the managed repository.
  - **macOS**: `brew install git` or install Xcode Command Line Tools (`xcode-select --install`)
  - **Linux**: `sudo apt install git` (Debian/Ubuntu) or `sudo dnf install git` (Fedora/RHEL)
  - **Windows**: Download the installer from <https://git-scm.com/download/win> or use `winget install Git.Git`

## Setup

1. `bun install`
2. `bun run build`
3. `bun run setup:repo`

## Commands

- `bun run check-updates`
- `bun run update-repo`
- `bun run start:mcp`

## Managed update policy

The plugin checks for upstream changes once per day on first use and tells the user when updates are available.
It does not apply updates automatically.
