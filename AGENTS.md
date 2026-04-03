# AGENTS

## Repo Overview

- `plugins/` contains repo-local Codex plugins. The active plugin in this repository is [`plugins/its-operating-model-mcp`](/home/rmicua/projects/its-operating-model-ai-plugins/plugins/its-operating-model-mcp).
- `plugins/its-operating-model-mcp/src/` contains the TypeScript implementation for the plugin entrypoints.
- `plugins/its-operating-model-mcp/tests/` contains the Vitest test suite for the plugin scaffold and later behavior.
- `plugins/its-operating-model-mcp/skills/` contains plugin-local skill content and related guidance.
- `docs/superpowers/specs/` contains design and requirements documents.
- `docs/superpowers/plans/` contains execution checklists and implementation plans.
- `.agents/plugins/` contains local plugin marketplace metadata used to surface repo-local plugins.

## Tooling

- Use `bun` for package management and script execution in this repository.
- Prefer `bun install` to install dependencies.
- Prefer `bun test` to run tests.
- Prefer `bun run build` to build the TypeScript plugin package.

## Notes

- The main implementation target in this repo is the `its-operating-model-mcp` plugin.
- Keep new docs and plan updates under `docs/superpowers/` unless there is a stronger plugin-local reason to place them elsewhere.
