import { POLISH_LETTERS, type PolishLetter } from "./types.js";

export function normalizeWord(input: string): string {
  return input.trim().toLocaleLowerCase("pl-PL");
}

export function isLetterKey(value: string): boolean {
  return (
    value.length === 1 &&
    (POLISH_LETTERS as readonly string[]).includes(value)
  );
}

export function assertPolishLetter(value: string): PolishLetter | null {
  const letter = normalizeWord(value);
  return isLetterKey(letter) ? (letter as PolishLetter) : null;
}
