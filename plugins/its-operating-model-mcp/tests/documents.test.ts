import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getDocumentByName, getStageGuidance } from "../src/documents";

describe("document routing", () => {
  it("maps start-here requests to README", () => {
    expect(getDocumentByName("get_start_here")?.relativePath).toBe("README.md");
  });

  it("maps stage 1 requests to the work assessment process", () => {
    expect(getStageGuidance("stage 1")?.relativePath).toBe(
      "work_delivery/work_assessment/work_assessment_process.md",
    );
  });

  it("maps small governed work to the work brief specification", () => {
    expect(getStageGuidance("small governed work")?.relativePath).toBe(
      "work_delivery/work_brief/work_brief_specification.md",
    );
  });
});

describe("manual update skill", () => {
  it("documents the managed update workflow", () => {
    const skillPath = resolve(process.cwd(), "skills/update-managed-repo/SKILL.md");

    expect(existsSync(skillPath)).toBe(true);
    expect(readFileSync(skillPath, "utf8")).toContain("bun run update-repo");
  });
});
