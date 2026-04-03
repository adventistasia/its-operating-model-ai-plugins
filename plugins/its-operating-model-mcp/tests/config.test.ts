import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  CONFIG_FILE_NAME,
  DEFAULT_REPO_BRANCH,
  DEFAULT_REPO_URL,
  getDefaultManagedRepoPath,
  loadPluginConfig,
  savePluginConfig,
} from "../src/config";

describe("config persistence", () => {
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

    expect(config.lastUpdateCheckDate).toBe("2026-04-03");
    expect(config.lastSeenLocalCommit).toBe("abc123");
    expect(config.lastSeenRemoteCommit).toBe("def456");
    expect(CONFIG_FILE_NAME).toBe("config.json");
  });
});
