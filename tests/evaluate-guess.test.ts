import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  evaluateGuess,
  mergeKeyboardMarks,
  upgradeKeyMark,
} from "../src/domain/evaluate-guess.js";

describe("evaluateGuess", () => {
  it("marks all correct for exact match", () => {
    assert.deepEqual(evaluateGuess("kotek", "kotek"), [
      "correct",
      "correct",
      "correct",
      "correct",
      "correct",
    ]);
  });

  it("handles duplicates like Wordle", () => {
    // answer has one "a"; first a present, second absent if wrong place
    assert.deepEqual(evaluateGuess("aabbb", "axxxx"), [
      "correct",
      "absent",
      "absent",
      "absent",
      "absent",
    ]);
    assert.deepEqual(evaluateGuess("baabb", "axxxx"), [
      "absent",
      "present",
      "absent",
      "absent",
      "absent",
    ]);
  });

  it("distinguishes Polish diacritics", () => {
    assert.deepEqual(evaluateGuess("ąćężł", "ąćężł"), [
      "correct",
      "correct",
      "correct",
      "correct",
      "correct",
    ]);
    assert.deepEqual(evaluateGuess("acezl", "ąćężł"), [
      "absent",
      "absent",
      "absent",
      "absent",
      "absent",
    ]);
  });

  it("throws on length mismatch", () => {
    assert.throws(() => evaluateGuess("abc", "abcde"));
  });
});

describe("keyboard mark merge", () => {
  it("only upgrades marks", () => {
    assert.equal(upgradeKeyMark("absent", "present"), "present");
    assert.equal(upgradeKeyMark("present", "absent"), "present");
    assert.equal(upgradeKeyMark("correct", "present"), "correct");
  });

  it("merges guess into keyboard map", () => {
    const next = mergeKeyboardMarks({}, "abcde", [
      "absent",
      "present",
      "correct",
      "absent",
      "present",
    ]);
    assert.deepEqual(next, {
      a: "absent",
      b: "present",
      c: "correct",
      d: "absent",
      e: "present",
    });
  });
});
