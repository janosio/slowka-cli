import type { TileMark } from "../domain/types.js";

/** Colors aligned with the Słówka PWA palette. */
export const MARK_COLORS = {
  correct: "#3d9a8c",
  present: "#c0724a",
  absent: "#2c2e36",
  empty: "#1a1b20",
  tbd: "#4a4c56",
} as const;

export function markColor(mark: TileMark | "empty" | "tbd"): string {
  return MARK_COLORS[mark];
}

export function toastMessage(code: "tooShort" | "notInList" | null): string | null {
  if (code === "tooShort") return "Za krótkie — wpisz 5 liter.";
  if (code === "notInList") return "Nie ma takiego słowa na liście.";
  return null;
}
