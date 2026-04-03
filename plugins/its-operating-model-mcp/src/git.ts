import { execFile } from "node:child_process";

function runGit(args: string[], cwd?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile("git", args, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
        return;
      }
      resolve(stdout.trim());
    });
  });
}

export function cloneRepo(
  repoUrl: string,
  branch: string,
  targetPath: string,
): Promise<string> {
  return runGit(["clone", "--branch", branch, repoUrl, targetPath]).then(() =>
    runGit(["rev-parse", "HEAD"], targetPath),
  );
}

export function fetchRemote(targetPath: string): Promise<void> {
  return runGit(["fetch", "origin", "--quiet"], targetPath).then(() => undefined);
}

export function getHeadCommit(targetPath: string): Promise<string> {
  return runGit(["rev-parse", "HEAD"], targetPath);
}

export function getRemoteCommit(targetPath: string, branch: string): Promise<string> {
  return runGit(["rev-parse", `origin/${branch}`], targetPath);
}

export function pullFastForward(targetPath: string, branch: string): Promise<string> {
  return runGit(["pull", "--ff-only", "origin", branch], targetPath).then(() =>
    runGit(["rev-parse", "HEAD"], targetPath),
  );
}
