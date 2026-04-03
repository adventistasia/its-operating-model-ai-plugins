# ITS Operating Model MCP

This plugin scaffold is the starting point for a tool that will manage a local clone of the ITS Operating Model repository.
The declared runtime commands exist as placeholders for the later implementation and currently only report that the scaffold is not implemented yet.

## Runtime commands

- `bun run setup:repo`
- `bun run check-updates`
- `bun run update-repo`

## Notes

- `bun run start:mcp` is wired to `dist/server.js`, which is a scaffold placeholder for now.
- `bun run build` compiles the TypeScript source in `src/` to `dist/` once the scaffold is expanded.
