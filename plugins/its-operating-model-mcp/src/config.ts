import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  CONFIG_DIR_NAME,
  CONFIG_FILE_NAME,
  DEFAULT_REPO_BRANCH,
  DEFAULT_REPO_URL,
} from "./constants.js";

export { CONFIG_FILE_NAME, DEFAULT_REPO_BRANCH, DEFAULT_REPO_URL } from "./constants.js";

export type PluginConfig = {
  setupCompleted: boolean;
  repoUrl: string;
  trackedBranch: string;
  repoPath: string;
  lastUpdateCheckDate?: string;
  lastSeenLocalCommit?: string;
  lastSeenRemoteCommit?: string;
};

export function getConfigDir(root: string): string {
  return join(root, CONFIG_DIR_NAME);
}

export function getConfigPath(root: string): string {
  return join(getConfigDir(root), CONFIG_FILE_NAME);
}

export function getDefaultManagedRepoPath(root: string): string {
  return join(getConfigDir(root), "ssd-its-operating-model");
}

export function loadPluginConfig(root: string): PluginConfig {
  const path = getConfigPath(root);

  if (!existsSync(path)) {
    return {
      setupCompleted: false,
      repoUrl: DEFAULT_REPO_URL,
      trackedBranch: DEFAULT_REPO_BRANCH,
      repoPath: getDefaultManagedRepoPath(root),
    };
  }

  return JSON.parse(readFileSync(path, "utf8")) as PluginConfig;
}

export function savePluginConfig(root: string, config: PluginConfig): void {
  mkdirSync(getConfigDir(root), { recursive: true });
  writeFileSync(getConfigPath(root), JSON.stringify(config, null, 2));
}
