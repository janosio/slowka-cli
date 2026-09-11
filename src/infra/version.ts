import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Package version — always matches package.json. */
export function getPackageVersion(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const pkgPath = join(here, "..", "..", "package.json");
  const raw = JSON.parse(readFileSync(pkgPath, "utf8")) as { version?: string };
  if (!raw.version) {
    throw new Error("package.json is missing version");
  }
  return raw.version;
}
