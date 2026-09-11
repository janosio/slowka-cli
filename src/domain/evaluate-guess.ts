import type { TileMark } from "./types.js";

/**
 * Wordle-style colouring with correct duplicate handling:
 * 1. lock exact matches and consume those letters from the remaining bag
 * 2. mark leftovers as present only while the bag still has that letter
 */
export function evaluateGuess(guess: string, answer: string): TileMark[] {
  if (guess.length !== answer.length) {
    throw new Error("Guess and answer must be the same length");
  }

  const guessChars = [...guess];
  const answerChars = [...answer];
  const marks: TileMark[] = Array.from({ length: guessChars.length }, () => "absent");
  const remaining = new Map<string, number>();

  for (const ch of answerChars) {
    remaining.set(ch, (remaining.get(ch) ?? 0) + 1);
  }

  for (let i = 0; i < guessChars.length; i += 1) {
    const guessed = guessChars[i]!;
    if (guessed === answerChars[i]) {
      marks[i] = "correct";
      remaining.set(guessed, (remaining.get(guessed) ?? 1) - 1);
    }
  }

  for (let i = 0; i < guessChars.length; i += 1) {
    if (marks[i] === "correct") continue;
    const guessed = guessChars[i]!;
    const left = remaining.get(guessed) ?? 0;
    if (left > 0) {
      marks[i] = "present";
      remaining.set(guessed, left - 1);
    }
  }

  return marks;
}

const MARK_RANK: Record<TileMark, number> = {
  absent: 1,
  present: 2,
  correct: 3,
};

export function upgradeKeyMark(
  previous: TileMark | undefined,
  next: TileMark,
): TileMark {
  if (!previous) return next;
  return MARK_RANK[next] > MARK_RANK[previous] ? next : previous;
}

export function mergeKeyboardMarks(
  current: Readonly<Record<string, TileMark>>,
  guess: string,
  marks: readonly TileMark[],
): Record<string, TileMark> {
  const next = { ...current };
  const chars = [...guess];
  for (let i = 0; i < chars.length; i += 1) {
    const ch = chars[i];
    const mark = marks[i];
    if (!ch || !mark) continue;
    next[ch] = upgradeKeyMark(next[ch], mark);
  }
  return next;
}
