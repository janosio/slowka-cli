import type { ReactNode } from "react";
import { Box, Text } from "ink";
import {
  CLASSIC_MAX_ATTEMPTS,
  CLASSIC_WORD_LENGTH,
  type ClassicState,
  type TileMark,
} from "../domain/types.js";
import { markColor } from "./colors.js";

interface BoardProps {
  state: ClassicState;
}

function Tile({
  letter,
  mark,
}: {
  letter: string;
  mark: TileMark | "empty" | "tbd";
}) {
  const bg = markColor(mark);
  const display = (letter || " ").toLocaleUpperCase("pl-PL");
  const fg = mark === "empty" || mark === "tbd" ? "#e8e8ea" : "#ffffff";
  return (
    <Box width={4} marginRight={1}>
      <Text bold color={fg} backgroundColor={bg}>
        {` ${display} `}
      </Text>
    </Box>
  );
}

export function Board({ state }: BoardProps) {
  const rows: ReactNode[] = [];

  for (let r = 0; r < CLASSIC_MAX_ATTEMPTS; r += 1) {
    const guess = state.rows[r];
    const marks = state.evaluations[r];
    const isCurrent = r === state.rows.length && state.phase === "playing";
    const tiles: ReactNode[] = [];

    for (let c = 0; c < CLASSIC_WORD_LENGTH; c += 1) {
      if (guess && marks) {
        const chars = [...guess];
        tiles.push(
          <Tile
            key={`${r}-${c}`}
            letter={chars[c] ?? ""}
            mark={marks[c] ?? "absent"}
          />,
        );
      } else if (isCurrent) {
        const chars = [...state.current];
        const letter = chars[c] ?? "";
        tiles.push(
          <Tile
            key={`${r}-${c}`}
            letter={letter}
            mark={letter ? "tbd" : "empty"}
          />,
        );
      } else {
        tiles.push(<Tile key={`${r}-${c}`} letter="" mark="empty" />);
      }
    }

    rows.push(
      <Box key={r} marginBottom={r < CLASSIC_MAX_ATTEMPTS - 1 ? 1 : 0}>
        {tiles}
      </Box>,
    );
  }

  return <Box flexDirection="column">{rows}</Box>;
}
