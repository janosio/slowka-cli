import { render } from "ink";
import { loadDictionary } from "../infra/dictionary.js";
import {
  enterAlternateScreen,
  leaveAlternateScreen,
} from "../ui/clear-terminal.js";
import { App } from "../ui/app.js";
import type { AppView } from "../ui/menu-items.js";

export async function runApp(initialView: AppView = "menu"): Promise<void> {
  const dictionary = loadDictionary();
  enterAlternateScreen();
  try {
    let clearFrame = (): void => undefined;
    const instance = render(
      <App
        dictionary={dictionary}
        initialView={initialView}
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

export async function runPlay(): Promise<void> {
  await runApp("play");
}
