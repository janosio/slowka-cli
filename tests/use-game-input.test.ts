import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  lettersFromInput,
  unwrapInput,
} from "../src/ui/use-game-input.js";

describe("unwrapInput", () => {
  it("strips multiple Esc prefixes and marks meta", () => {
    const r = unwrapInput("\u001B\u001Bz", {
      ctrl: false,
      meta: false,
      escape: false,
    });
    assert.equal(r.text, "z");
    assert.equal(r.mods.meta, true);
    assert.equal(r.loneEscape, false);
  });

  it("detects lone escape", () => {
    const r = unwrapInput("", { ctrl: false, meta: true, escape: true });
    assert.equal(r.loneEscape, true);
  });
});

describe("lettersFromInput", () => {
  it("maps meta+z to ż", () => {
    assert.deepEqual(lettersFromInput("z", { meta: true }), ["ż"]);
  });

  it("keeps unicode ż", () => {
    assert.deepEqual(lettersFromInput("ż", {}), ["ż"]);
  });

  it("maps after double-esc unwrap", () => {
    const { text, mods } = unwrapInput("\u001B\u001Bz", {
      ctrl: false,
      meta: false,
      escape: false,
    });
    assert.deepEqual(lettersFromInput(text, mods), ["ż"]);
  });
});
