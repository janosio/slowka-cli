import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  backspace,
  createClassicState,
  gameResult,
  submitGuess,
  typeLetter,
} from "../src/domain/classic-game.js";

const valid = new Set(["kotek", "domek", "lampa", "rzeka", "ptaki"]);
const isValid = (w: string) => valid.has(w);

describe("classic-game", () => {
  it("types letters and backspaces", () => {
    let state = createClassicState({ answer: "kotek", now: 1000 });
    state = typeLetter(state, "K");
    state = typeLetter(state, "o");
    assert.equal(state.current, "ko");
    state = backspace(state);
    assert.equal(state.current, "k");
  });

  it("accepts Polish diacritics including ż", () => {
    let state = createClassicState({ answer: "żółty", now: 1000 });
    for (const ch of "żółty") state = typeLetter(state, ch);
    assert.equal(state.current, "żółty");

    // NFD: z + combining dot above → still ż after normalize
    state = createClassicState({ answer: "żółty", now: 1000 });
    state = typeLetter(state, "z\u0307");
    assert.equal(state.current, "ż");
  });

  it("rejects short and unknown words", () => {
    let state = createClassicState({ answer: "kotek", now: 1000 });
    state = typeLetter(state, "k");
    state = submitGuess(state, isValid, 1100);
    assert.equal(state.toast, "tooShort");

    state = createClassicState({ answer: "kotek", now: 1000 });
    for (const ch of "xxxxx") state = typeLetter(state, ch);
    state = submitGuess(state, isValid, 1100);
    assert.equal(state.toast, "notInList");
    assert.equal(state.rows.length, 0);
  });

  it("wins on correct guess", () => {
    let state = createClassicState({ answer: "kotek", now: 1000 });
    for (const ch of "kotek") state = typeLetter(state, ch);
    state = submitGuess(state, isValid, 2500);
    assert.equal(state.phase, "won");
    assert.deepEqual(gameResult(state), {
      outcome: "won",
      attempts: 1,
      elapsedMs: 1500,
    });
  });

  it("loses after 5 valid attempts", () => {
    let state = createClassicState({ answer: "kotek", now: 1000 });
    const guesses = ["domek", "lampa", "rzeka", "ptaki", "domek"];
    for (const guess of guesses) {
      for (const ch of guess) state = typeLetter(state, ch);
      state = submitGuess(state, isValid, state.now + 100);
    }
    assert.equal(state.phase, "lost");
    assert.equal(state.rows.length, 5);
    assert.equal(gameResult(state)?.outcome, "lost");
  });

  it("ignores input after finished", () => {
    let state = createClassicState({ answer: "kotek", now: 1000 });
    for (const ch of "kotek") state = typeLetter(state, ch);
    state = submitGuess(state, isValid, 2000);
    const after = typeLetter(state, "a");
    assert.equal(after.current, "");
    assert.equal(after.phase, "won");
  });
});
