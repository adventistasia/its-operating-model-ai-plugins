import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { loadPluginConfig } from "./config.js";
import { getDocumentByName, getStageGuidance } from "./documents.js";
import { currentDir } from "./meta.js";

const server = new McpServer({ name: "its-operating-model", version: "0.1.0" });

function readManagedDocument(relativePath: string): string {
  const pluginRoot = join(currentDir(import.meta.url), "..");
  const config = loadPluginConfig(pluginRoot);

  if (!config.setupCompleted) {
    return "Plugin not set up. Run: bun run setup:repo";
  }

  if (!existsSync(config.repoPath)) {
    return `Managed repo not found at ${config.repoPath}. Run: bun run setup:repo`;
  }

  try {
    return readFileSync(join(config.repoPath, relativePath), "utf8");
  } catch {
    return `Could not read file: ${relativePath}. Run: bun run setup:repo`;
  }
}

server.tool("get_document", { name: z.string() }, async ({ name }) => {
  const doc = getDocumentByName(name);

  return {
    content: [
      {
        type: "text" as const,
        text: doc
          ? `Source: ${doc.relativePath}\n\n${readManagedDocument(doc.relativePath)}`
          : `Unknown document: ${name}`,
      },
    ],
  };
});

server.tool(
  "get_stage_guidance",
  { stage_or_intent: z.string() },
  async ({ stage_or_intent }) => {
    const doc = getStageGuidance(stage_or_intent);

    return {
      content: [
        {
          type: "text" as const,
          text: doc
            ? `Source: ${doc.relativePath}\n\n${readManagedDocument(doc.relativePath)}`
            : "No stage guidance matched. Try a stage number, work brief, or initiative request.",
        },
      ],
    };
  },
);

async function main(): Promise<void> {
  await server.connect(new StdioServerTransport());
}

const invokedAsEntryPoint =
  typeof process.argv[1] === "string" &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedAsEntryPoint) {
  void main();
}
