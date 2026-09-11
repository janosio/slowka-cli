import type { ClassicStats, GameResult, StatsFile } from "./types.js";

export function emptyClassicStats(): ClassicStats {
  return {
    played: 0,
    wins: 0,
    losses: 0,
    attemptDist: [0, 0, 0, 0, 0],
    totalWinTimeMs: 0,
  };
}

export function emptyStatsFile(): StatsFile {
  return {
    version: 1,
    classic: emptyClassicStats(),
  };
}

export function applyClassicResult(
  stats: ClassicStats,
  result: GameResult,
): ClassicStats {
  const played = stats.played + 1;
  const won = result.outcome === "won";
  const attempts = Math.min(5, Math.max(1, result.attempts));
  const dist = [...stats.attemptDist] as ClassicStats["attemptDist"];
  if (won) {
    dist[attempts - 1] = (dist[attempts - 1] ?? 0) + 1;
  }
  return {
    played,
    wins: stats.wins + (won ? 1 : 0),
    losses: stats.losses + (won ? 0 : 1),
    attemptDist: dist,
    totalWinTimeMs: stats.totalWinTimeMs + (won ? result.elapsedMs : 0),
  };
}

export function winRate(stats: ClassicStats): number {
  if (stats.played === 0) return 0;
  return stats.wins / stats.played;
}

export function averageWinTimeMs(stats: ClassicStats): number | null {
  if (stats.wins === 0) return null;
  return stats.totalWinTimeMs / stats.wins;
}

export function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}
