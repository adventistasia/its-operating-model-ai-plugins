import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { describe, expect, test } from "vitest";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const pluginRoot = path.resolve(testDir, "..");
const repoRoot = path.resolve(pluginRoot, "..", "..");

function readJson(relativePath: string): unknown {
  const absolutePath = path.join(repoRoot, relativePath);
  return JSON.parse(readFileSync(absolutePath, "utf8")) as unknown;
}

function readText(relativePath: string): string {
  const absolutePath = path.join(repoRoot, relativePath);
  return readFileSync(absolutePath, "utf8");
}

function runNodeEntry(entry: string, args: string[] = []): string {
  return execFileSync(process.execPath, [entry, ...args], {
    cwd: pluginRoot,
    encoding: "utf8",
  });
}

describe("its-operating-model-mcp scaffold", () => {
  test("includes the expected repo-local plugin scaffold files and metadata", () => {
    const pkg = readJson("plugins/its-operating-model-mcp/package.json") as {
      name: string;
      scripts: Record<string, string>;
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    const plugin = readJson("plugins/its-operating-model-mcp/.codex-plugin/plugin.json") as {
      name: string;
      mcpServers: string;
    };
    const mcp = readJson("plugins/its-operating-model-mcp/.mcp.json") as {
      mcpServers: Record<string, { command: string; args: string[] }>;
    };
    const tsconfig = readJson("plugins/its-operating-model-mcp/tsconfig.json") as {
      include: string[];
    };
    const readme = readText("plugins/its-operating-model-mcp/README.md");
    const marketplace = readJson(".agents/plugins/marketplace.json") as {
      name: string;
      interface: { displayName: string };
      plugins: Array<{
        name: string;
        source: { source: string; path: string };
        policy: { installation: string; authentication: string };
        category: string;
      }>;
    };
    const gitignore = readText(".gitignore");
    const cliSource = readText("plugins/its-operating-model-mcp/src/cli.ts");
    const serverSource = readText("plugins/its-operating-model-mcp/src/server.ts");

    expect(pkg).toMatchObject({
      name: "its-operating-model-mcp",
      version: "0.1.0",
      scripts: {
        build: expect.any(String),
        test: expect.any(String),
        "setup:repo": expect.any(String),
        "check-updates": expect.any(String),
        "update-repo": expect.any(String),
        "start:mcp": expect.any(String),
      },
      dependencies: {
        "@modelcontextprotocol/sdk": "^1.10.0",
        zod: "^3.24.2",
      },
      devDependencies: {
        "@types/node": "^22.14.0",
        typescript: "^5.8.3",
        vitest: "^3.1.1",
      },
    });
    expect(plugin).toMatchObject({
      name: "its-operating-model-mcp",
      version: "0.1.0",
      description: "Managed ITS Operating Model MCP plugin",
      mcpServers: "./.mcp.json",
      author: {
        name: "SSD ITS",
        email: "its@example.org",
        url: "https://github.com/adventistasia",
      },
      homepage: "https://github.com/adventistasia/ssd-its-operating-model",
      repository: "https://github.com/adventistasia/ssd-its-operating-model",
      interface: {
        websiteURL: "https://github.com/adventistasia/ssd-its-operating-model",
        privacyPolicyURL: "https://github.com/adventistasia/ssd-its-operating-model",
        termsOfServiceURL: "https://github.com/adventistasia/ssd-its-operating-model",
        brandColor: "#1F5F8B",
        defaultPrompt: [
          "Open the ITS Operating Model start-here guide.",
          "Find the right deliverable specification for this stage.",
          "Check whether the managed ITS repo has updates.",
        ],
      },
    });
    expect(mcp.mcpServers["its-operating-model"]).toMatchObject({
      command: "bun",
      args: ["./dist/server.js"],
    });
    expect(pkg.scripts).toMatchObject({
      build: "tsc -p tsconfig.json",
      test: "vitest run",
      "setup:repo": "bun ./dist/cli.js setup",
      "check-updates": "bun ./dist/cli.js check-updates",
      "update-repo": "bun ./dist/cli.js update-repo",
      "start:mcp": "bun ./dist/server.js",
    });
    expect(tsconfig.include).toEqual(["src/**/*.ts"]);
    expect(readme).toContain("local clone");
    expect(readme).toContain("scaffold");
    expect(readme).toContain("not implemented yet");
    expect(readme).toContain("setup:repo");
    expect(readme).toContain("check-updates");
    expect(readme).toContain("update-repo");
    expect(marketplace).toMatchObject({
      name: "local-repo-plugins",
      interface: {
        displayName: "Local Repo Plugins",
      },
    });
    expect(marketplace.plugins).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "its-operating-model-mcp",
          source: {
            source: "local",
            path: "./plugins/its-operating-model-mcp",
          },
          policy: {
            installation: "AVAILABLE",
            authentication: "ON_INSTALL",
          },
          category: "Productivity",
        }),
      ]),
    );
    expect(gitignore).toContain("plugins/its-operating-model-mcp/dist/");
    expect(gitignore).toContain("plugins/its-operating-model-mcp/.runtime/");
    expect(existsSync(path.join(pluginRoot, "skills"))).toBe(true);
    expect(cliSource).toContain("not implemented yet");
    expect(serverSource).toContain("not implemented yet");
  });

  test("built entrypoints emit scaffold placeholder output when launched directly", () => {
    execFileSync(process.execPath, ["./node_modules/typescript/bin/tsc", "-p", "tsconfig.json"], {
      cwd: pluginRoot,
      encoding: "utf8",
      stdio: "pipe",
    });

    expect(runNodeEntry("./dist/cli.js", ["setup"])).toContain("not implemented yet");
    expect(runNodeEntry("./dist/cli.js", ["check-updates"])).toContain("not implemented yet");
    expect(runNodeEntry("./dist/cli.js", ["update-repo"])).toContain("not implemented yet");
    expect(runNodeEntry("./dist/server.js")).toContain("not implemented yet");
  });
});
