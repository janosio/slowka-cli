import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { emptyStatsFile } from "../domain/stats.js";
import type { ClassicStats, StatsFile } from "../domain/types.js";

function configDir(): string {
  if (process.env.SLOWKA_CLI_CONFIG_DIR) {
    return process.env.SLOWKA_CLI_CONFIG_DIR;
  }
  const xdg = process.env.XDG_CONFIG_HOME;
  if (xdg) return join(xdg, "slowka-cli");
  return join(homedir(), ".config", "slowka-cli");
}

export function statsFilePath(): string {
  return join(configDir(), "stats.json");
}

function isClassicStats(value: unknown): value is ClassicStats {
  if (!value || typeof value !== "object") return false;
  const s = value as Record<string, unknown>;
  return (
    typeof s.played === "number" &&
    typeof s.wins === "number" &&
    typeof s.losses === "number" &&
    Array.isArray(s.attemptDist) &&
    s.attemptDist.length === 5 &&
    typeof s.totalWinTimeMs === "number"
  );
}

function parseStats(raw: string): StatsFile {
  const data = JSON.parse(raw) as unknown;
  if (!data || typeof data !== "object") return emptyStatsFile();
  const file = data as Record<string, unknown>;
  if (file.version !== 1 || !isClassicStats(file.classic)) {
    return emptyStatsFile();
  }
  return { version: 1, classic: file.classic };
}

export async function loadStats(): Promise<StatsFile> {
  try {
    const raw = await readFile(statsFilePath(), "utf8");
    return parseStats(raw);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") return emptyStatsFile();
    throw error;
  }
}

export async function saveStats(stats: StatsFile): Promise<void> {
  const path = statsFilePath();
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(stats, null, 2)}\n`, "utf8");
}

export async function updateClassicStats(
  updater: (classic: ClassicStats) => ClassicStats,
): Promise<StatsFile> {
  const file = await loadStats();
  const next: StatsFile = {
    version: 1,
    classic: updater(file.classic),
  };
  await saveStats(next);
  return next;
}
