import { pathToFileURL } from "node:url";

export function runServer(): string {
  const message = "its-operating-model-mcp scaffold: server entrypoint not implemented yet.";
  console.info(message);
  return message;
}

const invokedAsEntryPoint =
  typeof process.argv[1] === "string" &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedAsEntryPoint) {
  runServer();
}
