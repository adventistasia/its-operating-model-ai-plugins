import { describe, expect, it, vi } from "vitest";
import { REQUIRED_DOCS } from "../src/constants";
import { checkForDailyUpdates, createManagedRepo, validateManagedRepo } from "../src/repo-manager";

describe("repo manager", () => {
  it("validates required authoritative files", () => {
    const exists = vi.fn((file: string) => REQUIRED_DOCS.includes(file as never));

    expect(validateManagedRepo("C:/managed/repo", exists)).toEqual({ ok: true, missing: [] });
  });

  it("skips update fetch after daily check is recorded", async () => {
    const fetchRemote = vi.fn();

    const result = await checkForDailyUpdates(
      {
        setupCompleted: true,
        repoUrl: "https://github.com/adventistasia/ssd-its-operating-model",
        trackedBranch: "main",
        repoPath: "C:/managed/repo",
        lastUpdateCheckDate: "2026-04-03",
        lastSeenLocalCommit: "local-1",
        lastSeenRemoteCommit: "remote-1",
      },
      "2026-04-03",
      fetchRemote,
    );

    expect(result.status).toBe("skipped");
    expect(fetchRemote).not.toHaveBeenCalled();
  });

  it("clones the managed repo during setup", async () => {
    const cloneRepo = vi.fn().mockResolvedValue("local-commit");

    const result = await createManagedRepo(
      {
        setupCompleted: false,
        repoUrl: "https://github.com/adventistasia/ssd-its-operating-model",
        trackedBranch: "main",
        repoPath: "C:/managed/repo",
      },
      cloneRepo,
      () => ({ ok: true, missing: [] }),
    );

    expect(cloneRepo).toHaveBeenCalledWith(
      "https://github.com/adventistasia/ssd-its-operating-model",
      "main",
      "C:/managed/repo",
    );
    expect(result.setupCompleted).toBe(true);
  });
});
