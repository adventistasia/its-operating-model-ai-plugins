import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { loadPluginConfig, savePluginConfig } from "./config.js";
import { currentDir } from "./meta.js";
import {
  applyRepoUpdate,
  checkForDailyUpdates,
  createManagedRepo,
} from "./repo-manager.js";

export function parseCliArgs(
  args: string[],
): { command: "setup" | "check-updates" | "update-repo" } {
  const [command] = args;

  if (
    command === "setup" ||
    command === "check-updates" ||
    command === "update-repo"
  ) {
    return { command };
  }

  throw new Error(`Unsupported command: ${command ?? "undefined"}`);
}

export function formatUpdateMessage(result: {
  status: "update-available" | "up-to-date";
  localCommit: string;
  remoteCommit: string;
}): string {
  if (result.status === "up-to-date") {
    return `Managed repo is up to date at ${result.localCommit}.`;
  }

  return `Update available. Local ${result.localCommit} -> remote ${result.remoteCommit}. Run bun run update-repo to apply it.`;
}

export async function main(): Promise<void> {
  const { command } = parseCliArgs(process.argv.slice(2));
  const pluginRoot = join(currentDir(import.meta.url), "..");
  let config = loadPluginConfig(pluginRoot);

  if (command === "setup") {
    config = await createManagedRepo(config);
    savePluginConfig(pluginRoot, config);
    console.log(`Managed repo installed at ${config.repoPath}`);
    return;
  }

  if (!config.setupCompleted) {
    console.error("Managed repo has not been set up. Run: bun run setup:repo");
    process.exit(1);
  }

  const today = new Date().toISOString().slice(0, 10);

  if (command === "check-updates") {
    const result = await checkForDailyUpdates(config, today);
    savePluginConfig(pluginRoot, result.config);

    if (result.status === "skipped") {
      console.log("Daily update check already completed today.");
      return;
    }

    console.log(
      formatUpdateMessage({
        status: result.status === "update-available" ? "update-available" : "up-to-date",
        localCommit: result.config.lastSeenLocalCommit ?? "unknown",
        remoteCommit: result.config.lastSeenRemoteCommit ?? "unknown",
      }),
    );
    return;
  }

  config = await applyRepoUpdate(config);
  savePluginConfig(pluginRoot, config);
  console.log(`Managed repo updated to ${config.lastSeenLocalCommit}`);
}

const invokedAsEntryPoint =
  typeof process.argv[1] === "string" &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedAsEntryPoint) {
  void main();
}
