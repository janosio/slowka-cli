import { Box, Text, useInput } from "ink";
import { MENU_ITEMS, type MenuItem } from "./menu-items.js";

interface MenuScreenProps {
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onConfirm: (item: MenuItem) => void;
  onQuit: () => void;
}

export function MenuScreen({
  selectedIndex,
  onSelectIndex,
  onConfirm,
  onQuit,
}: MenuScreenProps) {
  useInput((input, key) => {
    if (key.escape || input === "q" || input === "Q") {
      onQuit();
      return;
    }

    if (key.upArrow) {
      onSelectIndex(
        selectedIndex <= 0 ? MENU_ITEMS.length - 1 : selectedIndex - 1,
      );
      return;
    }

    if (key.downArrow) {
      onSelectIndex((selectedIndex + 1) % MENU_ITEMS.length);
      return;
    }

    if (key.return) {
      const item = MENU_ITEMS[selectedIndex];
      if (item) onConfirm(item);
      return;
    }

    const digit = Number.parseInt(input, 10);
    if (digit >= 1 && digit <= MENU_ITEMS.length) {
      const item = MENU_ITEMS[digit - 1];
      if (item) onConfirm(item);
    }
  });

  return (
    <Box flexDirection="column" paddingX={1} paddingY={1}>
      <Text bold>Słówka CLI</Text>
      <Text dimColor>Wybierz tryb · ↑↓ Enter · 1–{MENU_ITEMS.length} · Esc</Text>
      <Box marginTop={1} flexDirection="column">
        {MENU_ITEMS.map((item, index) => {
          const active = index === selectedIndex;
          return (
            <Box key={item.id} flexDirection="column" marginBottom={1}>
              <Text
                bold={active}
                color={active ? "cyan" : undefined}
                inverse={active}
              >
                {active ? "❯ " : "  "}
                {index + 1}. {item.label}
              </Text>
              <Text dimColor>    {item.hint}</Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
