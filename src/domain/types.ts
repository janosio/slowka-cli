export type TileMark = "correct" | "present" | "absent";

export type GamePhase = "playing" | "won" | "lost";

export type ToastCode = "tooShort" | "notInList" | null;

export interface ClassicStats {
  played: number;
  wins: number;
  losses: number;
  attemptDist: [number, number, number, number, number];
  totalWinTimeMs: number;
}

export interface StatsFile {
  version: 1;
  classic: ClassicStats;
}

export interface ClassicState {
  version: 1;
  answer: string;
  rows: string[];
  evaluations: TileMark[][];
  current: string;
  keyboard: Record<string, TileMark>;
  phase: GamePhase;
  startedAt: number;
  finishedAt: number | null;
  now: number;
  toast: ToastCode;
}

export interface GameResult {
  outcome: "won" | "lost";
  attempts: number;
  elapsedMs: number;
}

export const CLASSIC_WORD_LENGTH = 5;
export const CLASSIC_MAX_ATTEMPTS = 5;

export const POLISH_LETTERS = [
  "a",
  "ą",
  "b",
  "c",
  "ć",
  "d",
  "e",
  "ę",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "ł",
  "m",
  "n",
  "ń",
  "o",
  "ó",
  "p",
  "q",
  "r",
  "s",
  "ś",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "ź",
  "ż",
] as const;

export type PolishLetter = (typeof POLISH_LETTERS)[number];
