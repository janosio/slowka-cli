import { Box, Text } from "ink";
import {
  averageWinTimeMs,
  formatDuration,
  winRate,
} from "../domain/stats.js";
import type { ClassicStats } from "../domain/types.js";

interface StatsScreenProps {
  classic: ClassicStats;
}

function bar(count: number, max: number, width = 20): string {
  if (max <= 0 || count <= 0) return "·".repeat(width);
  const filled = Math.max(1, Math.round((count / max) * width));
  return `${"#".repeat(filled)}${"·".repeat(Math.max(0, width - filled))}`;
}

export function StatsScreen({ classic }: StatsScreenProps) {
  const rate = winRate(classic);
  const avg = averageWinTimeMs(classic);
  const maxDist = Math.max(1, ...classic.attemptDist);

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold>Słówka CLI — statystyki treningu</Text>
      <Box marginTop={1} flexDirection="column">
        <Text>Rozegrane: {classic.played}</Text>
        <Text>
          Wygrane: {classic.wins} · Przegrane: {classic.losses}
        </Text>
        <Text>
          Skuteczność: {(rate * 100).toFixed(1)}%
          {avg !== null ? ` · śr. czas wygranej: ${formatDuration(avg)}` : ""}
        </Text>
      </Box>
      <Box marginTop={1} flexDirection="column">
        <Text bold>Rozkład prób (wygrane)</Text>
        {classic.attemptDist.map((count, i) => (
          <Text key={i}>
            {i + 1}: {bar(count, maxDist)} {count}
          </Text>
        ))}
      </Box>
      {classic.played === 0 ? (
        <Box marginTop={1}>
          <Text dimColor>Brak gier — uruchom: slowka play</Text>
        </Box>
      ) : null}
    </Box>
  );
}
