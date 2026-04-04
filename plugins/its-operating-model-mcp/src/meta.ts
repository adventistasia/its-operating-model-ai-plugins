import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

export function currentDir(importMetaUrl: string): string {
  return dirname(fileURLToPath(importMetaUrl));
}
