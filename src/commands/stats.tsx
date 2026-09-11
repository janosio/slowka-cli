import { runApp } from "./play.js";

export async function runStats(): Promise<void> {
  await runApp("stats");
}

export async function runMenu(): Promise<void> {
  await runApp("menu");
}
