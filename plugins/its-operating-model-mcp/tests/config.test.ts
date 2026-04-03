import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  CONFIG_FILE_NAME,
  DEFAULT_REPO_BRANCH,
  DEFAULT_REPO_URL,
  getDefaultManagedRepoPath,
  loadPluginConfig,
  savePluginConfig,
} from "../src/config";

describe("config persistence", () => {
  const testDir = dirname(fileURLToPath(import.meta.url));
  const pluginRoot = resolve(testDir, "..");
  const roots: string[] = [];

  afterEach(() => {
    roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
  });

  it("returns defaults before setup completes", () => {
    const root = mkdtempSync(join(tmpdir(), "its-mcp-"));
    roots.push(root);

    const config = loadPluginConfig(root);

    expect(config.setupCompleted).toBe(false);
    expect(config.repoUrl).toBe(DEFAULT_REPO_URL);
    expect(config.trackedBranch).toBe(DEFAULT_REPO_BRANCH);
    expect(config.repoPath).toBe(getDefaultManagedRepoPath(root));
  });

  it("round-trips saved config values", () => {
    const root = mkdtempSync(join(tmpdir(), "its-mcp-"));
    roots.push(root);

    savePluginConfig(root, {
      setupCompleted: true,
      repoUrl: DEFAULT_REPO_URL,
      trackedBranch: DEFAULT_REPO_BRANCH,
      repoPath: join(root, "managed-repo"),
      lastUpdateCheckDate: "2026-04-03",
      lastSeenLocalCommit: "abc123",
      lastSeenRemoteCommit: "def456",
    });

    const config = loadPluginConfig(root);

    expect(config.setupCompleted).toBe(true);
    expect(config.repoUrl).toBe(DEFAULT_REPO_URL);
    expect(config.trackedBranch).toBe(DEFAULT_REPO_BRANCH);
    expect(config.repoPath).toBe(join(root, "managed-repo"));
    expect(config.lastUpdateCheckDate).toBe("2026-04-03");
    expect(config.lastSeenLocalCommit).toBe("abc123");
    expect(config.lastSeenRemoteCommit).toBe("def456");
    expect(CONFIG_FILE_NAME).toBe("config.json");
  });

  it("builds and keeps scaffold entrypoints runnable", () => {
    execFileSync("bun", ["run", "build"], {
      cwd: pluginRoot,
      encoding: "utf8",
      stdio: "pipe",
    });

    execFileSync("node", ["./dist/cli.js", "setup"], {
      cwd: pluginRoot,
      encoding: "utf8",
      stdio: "pipe",
    });
    execFileSync("node", ["./dist/server.js"], {
      cwd: pluginRoot,
      encoding: "utf8",
      stdio: "pipe",
    });

    const cliSource = readFileSync(join(pluginRoot, "src/cli.ts"), "utf8");
    const serverSource = readFileSync(join(pluginRoot, "src/server.ts"), "utf8");
    expect(cliSource).toContain("not implemented yet");
    expect(serverSource).toContain("not implemented yet");
  });
});
