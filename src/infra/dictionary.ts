import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeWord } from "../domain/normalize.js";

const HERE = dirname(fileURLToPath(import.meta.url));

function dataPath(file: string): string {
  return join(HERE, "..", "..", "data", file);
}

function loadWordList(file: string): string[] {
  const raw = JSON.parse(readFileSync(dataPath(file), "utf8")) as unknown;
  if (!Array.isArray(raw)) {
    throw new Error(`Expected array in ${file}`);
  }
  return raw.map((w) => normalizeWord(String(w)));
}

export interface Dictionary {
  answers: readonly string[];
  isValid: (word: string) => boolean;
  pickAnswer: (random?: () => number) => string;
}

export function loadDictionary(): Dictionary {
  const answers = loadWordList("classic-answers.json");
  const validList = loadWordList("classic-valid.json");
  const valid = new Set([...validList, ...answers]);

  if (answers.length === 0) {
    throw new Error("Answer dictionary is empty");
  }

  return {
    answers,
    isValid: (word: string) => valid.has(normalizeWord(word)),
    pickAnswer(random = Math.random) {
      const index = Math.floor(random() * answers.length);
      return answers[index] ?? answers[0]!;
    },
  };
}
