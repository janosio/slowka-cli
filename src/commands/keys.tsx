import { Box, Text, render, useApp, useInput } from "ink";
import { useState } from "react";
import { lettersFromInput, unwrapInput } from "../ui/use-game-input.js";

/** Interactive key probe — prints what Ink delivers vs what we resolve. */
export async function runKeysProbe(): Promise<void> {
  const instance = render(<KeysProbe />);
  await instance.waitUntilExit();
}

function KeysProbe() {
  const { exit } = useApp();
  const [lines, setLines] = useState<string[]>([
    "Naciśnij ż / ⌥Z (i inne). q = wyjście.",
  ]);

  useInput((input, key) => {
    if (input === "q" || input === "Q") {
      exit();
      return;
    }

    const { text, mods, loneEscape } = unwrapInput(input, key);
    const letters = lettersFromInput(text, mods);
    const cps = [...input].map(
      (c) => "U+" + (c.codePointAt(0)?.toString(16) ?? "?"),
    );
    const row = [
      `raw=${JSON.stringify(input)} [${cps.join(" ")}]`,
      `esc=${key.escape} meta=${key.meta} ctrl=${key.ctrl}`,
      `→ text=${JSON.stringify(text)} meta=${mods.meta} loneEsc=${loneEscape}`,
      `letters=[${letters.join(",")}]`,
    ].join(" | ");

    setLines((prev) => [...prev.slice(-14), row]);
  });

  return (
    <Box flexDirection="column" paddingX={1}>
      <Text bold>slowka keys — sonda wejścia</Text>
      {lines.map((line, i) => (
        <Text key={i}>{line}</Text>
      ))}
      <Text dimColor>q = wyjście</Text>
    </Box>
  );
}
