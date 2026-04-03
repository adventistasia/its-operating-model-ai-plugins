import { existsSync } from "node:fs";
import { join } from "node:path";
import type { PluginConfig } from "./config.js";
import { REQUIRED_DOCS } from "./constants.js";
import {
  cloneRepo,
  fetchRemote,
  getHeadCommit,
  getRemoteCommit,
  pullFastForward,
} from "./git.js";

export type ValidationResult = {
  ok: boolean;
  missing: string[];
};

export function validateManagedRepo(
  repoPath: string,
  fileExists: (path: string) => boolean = (path) => existsSync(join(repoPath, path)),
): ValidationResult {
  const missing = REQUIRED_DOCS.filter((path) => !fileExists(path));
  return { ok: missing.length === 0, missing: [...missing] };
}

export async function createManagedRepo(
  config: PluginConfig,
  clone: (repoUrl: string, branch: string, targetPath: string) => Promise<string> = cloneRepo,
  validate: (repoPath: string) => ValidationResult = validateManagedRepo,
): Promise<PluginConfig> {
  const localCommit = await clone(config.repoUrl, config.trackedBranch, config.repoPath);
  const validation = validate(config.repoPath);

  if (!validation.ok) {
    throw new Error(
      `Managed repo is missing required files: ${validation.missing.join(", ")}`,
    );
  }

  return {
    ...config,
    setupCompleted: true,
    lastSeenLocalCommit: localCommit,
    lastSeenRemoteCommit: localCommit,
  };
}

type FetchResult = {
  localCommit: string;
  remoteCommit: string;
};

type DailyUpdateResult = {
  status: "skipped" | "up-to-date" | "update-available";
  config: PluginConfig;
};

export async function checkForDailyUpdates(
  config: PluginConfig,
  currentDate: string,
  fetch: (repoPath: string, branch: string) => Promise<FetchResult> = async (
    repoPath,
    branch,
  ) => {
    await fetchRemote(repoPath);
    return {
      localCommit: await getHeadCommit(repoPath),
      remoteCommit: await getRemoteCommit(repoPath, branch),
    };
  },
): Promise<DailyUpdateResult> {
  if (config.lastUpdateCheckDate === currentDate) {
    return { status: "skipped", config };
  }

  const { localCommit, remoteCommit } = await fetch(config.repoPath, config.trackedBranch);
  const nextConfig: PluginConfig = {
    ...config,
    lastUpdateCheckDate: currentDate,
    lastSeenLocalCommit: localCommit,
    lastSeenRemoteCommit: remoteCommit,
  };

  return {
    status: localCommit === remoteCommit ? "up-to-date" : "update-available",
    config: nextConfig,
  };
}

export async function applyRepoUpdate(config: PluginConfig): Promise<PluginConfig> {
  const updatedCommit = await pullFastForward(config.repoPath, config.trackedBranch);
  return {
    ...config,
    lastSeenLocalCommit: updatedCommit,
    lastSeenRemoteCommit: updatedCommit,
  };
}
