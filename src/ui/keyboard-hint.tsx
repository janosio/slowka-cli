import { Box, Text } from "ink";
import type { TileMark } from "../domain/types.js";
import { markColor } from "./colors.js";

const ROWS: readonly (readonly string[])[] = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
  ["ą", "ć", "ę", "ł", "ń", "ó", "ś", "ź", "ż"],
];

interface KeyboardHintProps {
  keyboard: Readonly<Record<string, TileMark>>;
}

function Key({ letter, mark }: { letter: string; mark: TileMark | undefined }) {
  const label = ` ${letter.toLocaleUpperCase("pl-PL")} `;

  if (!mark) {
    return <Text color="#c8c8d0">{label}</Text>;
  }

  if (mark === "absent") {
    // Used but not in the word — visibly grayed out
    return (
      <Text color="#5c5d66" backgroundColor="#2a2b31">
        {label}
      </Text>
    );
  }

  return (
    <Text bold color="#ffffff" backgroundColor={markColor(mark)}>
      {label}
    </Text>
  );
}

export function KeyboardHint({ keyboard }: KeyboardHintProps) {
  return (
    <Box flexDirection="column">
      {ROWS.map((row, i) => (
        <Box key={i}>
          {row.map((letter) => (
            <Key key={letter} letter={letter} mark={keyboard[letter]} />
          ))}
        </Box>
      ))}
      <Box marginTop={1}>
        <Text dimColor>
          Enter = zatwierdź · Backspace = skasuj · Esc = menu · n = następna
          (po grze)
        </Text>
      </Box>
    </Box>
  );
}
