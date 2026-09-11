import { POLISH_LETTERS, type PolishLetter } from "./types.js";

/** Polish Programmer layout: Option/AltGr + base letter → diacritic. */
export const POLISH_PROGRAMMER_ALT: Readonly<Record<string, PolishLetter>> = {
  a: "ą",
  c: "ć",
  e: "ę",
  l: "ł",
  n: "ń",
  o: "ó",
  s: "ś",
  x: "ź",
  z: "ż",
};

export function normalizeWord(input: string): string {
  // NFC so decomposed ż (z + combining dot) matches the precomposed letter.
  return input.trim().normalize("NFC").toLocaleLowerCase("pl-PL");
}

export function isLetterKey(value: string): boolean {
  return (
    [...value].length === 1 &&
    (POLISH_LETTERS as readonly string[]).includes(value)
  );
}

export function assertPolishLetter(value: string): PolishLetter | null {
  const letter = normalizeWord(value);
  return isLetterKey(letter) ? (letter as PolishLetter) : null;
}

export interface KeyModifiers {
  ctrl?: boolean;
  meta?: boolean;
}

/**
 * Resolve a key event to a Polish letter.
 * Handles Option-as-Meta terminals (Esc+z → z+meta instead of ż)
 * and AltGr (often ctrl+meta with either ż or base z).
 */
export function resolveTypedLetter(
  raw: string,
  mods: KeyModifiers = {},
): PolishLetter | null {
  const lower = normalizeWord(raw);
  if ([...lower].length !== 1) return null;

  // Prefer Programmer Alt mapping when Meta/Option was held (Esc+z → ż).
  if (mods.meta && POLISH_PROGRAMMER_ALT[lower]) {
    return POLISH_PROGRAMMER_ALT[lower];
  }

  if (!isLetterKey(lower)) return null;

  // Pure Ctrl+letter shortcuts (Ink sets input to the letter name).
  // AltGr on Windows is often ctrl+meta — those are allowed above / here.
  if (mods.ctrl && !mods.meta && /^[a-z]$/.test(lower)) {
    return null;
  }

  return lower as PolishLetter;
}
