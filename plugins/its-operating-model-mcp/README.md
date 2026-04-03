# ITS Operating Model MCP

This plugin manages a local clone of the ITS Operating Model repository and serves authoritative documents through MCP.

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
