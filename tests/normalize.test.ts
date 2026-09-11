import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  normalizeWord,
  resolveTypedLetter,
} from "../src/domain/normalize.js";

describe("normalizeWord", () => {
  it("NFC-composes decomposed ż", () => {
    assert.equal(normalizeWord("z\u0307"), "ż");
  });
});

describe("resolveTypedLetter", () => {
  it("accepts precomposed Polish letters", () => {
    assert.equal(resolveTypedLetter("ż"), "ż");
    assert.equal(resolveTypedLetter("Ż"), "ż");
    assert.equal(resolveTypedLetter("ą"), "ą");
  });

  it("maps Option/Meta + base key via Polish Programmer layout", () => {
    assert.equal(resolveTypedLetter("z", { meta: true }), "ż");
    assert.equal(resolveTypedLetter("Z", { meta: true }), "ż");
    assert.equal(resolveTypedLetter("x", { meta: true }), "ź");
    assert.equal(resolveTypedLetter("a", { meta: true }), "ą");
  });

  it("maps AltGr-style ctrl+meta + base key", () => {
    assert.equal(resolveTypedLetter("z", { ctrl: true, meta: true }), "ż");
  });

  it("keeps plain letters without meta", () => {
    assert.equal(resolveTypedLetter("z"), "z");
    assert.equal(resolveTypedLetter("a"), "a");
  });

  it("blocks pure Ctrl+letter shortcuts", () => {
    assert.equal(resolveTypedLetter("c", { ctrl: true }), null);
    assert.equal(resolveTypedLetter("z", { ctrl: true }), null);
  });

  it("still accepts Unicode diacritic even with ctrl (some terminals)", () => {
    assert.equal(resolveTypedLetter("ż", { ctrl: true }), "ż");
  });
});
