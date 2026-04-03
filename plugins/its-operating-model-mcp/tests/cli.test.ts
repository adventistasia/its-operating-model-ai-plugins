import { describe, expect, it } from "vitest";
import { formatUpdateMessage, parseCliArgs } from "../src/cli";

describe("cli helpers", () => {
  it("parses the setup command", () => {
    expect(parseCliArgs(["setup"])).toEqual({ command: "setup" });
  });

  it("formats an update-available prompt", () => {
    expect(
      formatUpdateMessage({
        status: "update-available",
        localCommit: "abc123",
        remoteCommit: "def456",
      }),
    ).toContain("Update available");
  });
});
