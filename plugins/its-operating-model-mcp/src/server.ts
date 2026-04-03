import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { loadPluginConfig } from "./config.js";
import { getDocumentByName, getStageGuidance } from "./documents.js";

const server = new McpServer({ name: "its-operating-model", version: "0.1.0" });

function readManagedDocument(relativePath: string): string {
  const pluginRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
  const config = loadPluginConfig(pluginRoot);
  return readFileSync(join(config.repoPath, relativePath), "utf8");
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

await server.connect(new StdioServerTransport());
