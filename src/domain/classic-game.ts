import { evaluateGuess, mergeKeyboardMarks } from "./evaluate-guess.js";
import { isLetterKey, normalizeWord } from "./normalize.js";
import {
  CLASSIC_MAX_ATTEMPTS,
  CLASSIC_WORD_LENGTH,
  type ClassicState,
  type GameResult,
  type ToastCode,
} from "./types.js";

export type ValidWordLookup = (word: string) => boolean;

export interface CreateGameParams {
  answer: string;
  now?: number;
}

function reject(state: ClassicState, toast: ToastCode): ClassicState {
  return { ...state, toast };
}

export function createClassicState(params: CreateGameParams): ClassicState {
  const now = params.now ?? Date.now();
  return {
    version: 1,
    answer: normalizeWord(params.answer),
    rows: [],
    evaluations: [],
    current: "",
    keyboard: {},
    phase: "playing",
    startedAt: now,
    finishedAt: null,
    now,
    toast: null,
  };
}

export function typeLetter(state: ClassicState, rawLetter: string): ClassicState {
  if (state.phase !== "playing") return state;
  const letter = normalizeWord(rawLetter);
  if (!isLetterKey(letter)) return state;
  if (state.current.length >= CLASSIC_WORD_LENGTH) return state;
  return { ...state, current: state.current + letter, toast: null };
}

export function backspace(state: ClassicState): ClassicState {
  if (state.phase !== "playing") return state;
  if (!state.current) return state;
  return { ...state, current: state.current.slice(0, -1), toast: null };
}

export function submitGuess(
  state: ClassicState,
  isValidWord: ValidWordLookup,
  now = Date.now(),
): ClassicState {
  if (state.phase !== "playing") return state;

  const playing = { ...state, now };

  if (playing.current.length < CLASSIC_WORD_LENGTH) {
    return reject(playing, "tooShort");
  }

  const guess = normalizeWord(playing.current);
  if (!isValidWord(guess)) {
    return reject(playing, "notInList");
  }

  const marks = evaluateGuess(guess, playing.answer);
  const rows = [...playing.rows, guess];
  const evaluations = [...playing.evaluations, marks];
  const keyboard = mergeKeyboardMarks(playing.keyboard, guess, marks);
  const won = marks.every((mark) => mark === "correct");
  const lost = !won && rows.length >= CLASSIC_MAX_ATTEMPTS;
  const finished = won || lost;

  return {
    ...playing,
    rows,
    evaluations,
    current: "",
    keyboard,
    phase: won ? "won" : lost ? "lost" : "playing",
    finishedAt: finished ? now : null,
    toast: null,
  };
}

export function gameResult(state: ClassicState): GameResult | null {
  if (state.phase === "playing" || state.finishedAt === null) return null;
  return {
    outcome: state.phase,
    attempts: state.rows.length,
    elapsedMs: Math.max(0, state.finishedAt - state.startedAt),
  };
}

export function elapsedMs(state: ClassicState): number {
  return Math.max(0, (state.finishedAt ?? state.now) - state.startedAt);
}
