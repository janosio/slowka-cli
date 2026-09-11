import { render } from "ink";
import { loadDictionary } from "../infra/dictionary.js";
import {
  enterAlternateScreen,
  leaveAlternateScreen,
} from "../ui/clear-terminal.js";
import { PlayScreen } from "../ui/play-screen.js";

export async function runPlay(): Promise<void> {
  const dictionary = loadDictionary();
  enterAlternateScreen();
  try {
    let clearFrame = (): void => undefined;
    const instance = render(
      <PlayScreen
        dictionary={dictionary}
        onBeforeRedraw={() => {
          clearFrame();
        }}
      />,
    );
    clearFrame = () => {
      instance.clear();
    };
    await instance.waitUntilExit();
  } finally {
    leaveAlternateScreen();
  }
}
