import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyClassicResult,
  averageWinTimeMs,
  emptyClassicStats,
  formatDuration,
  winRate,
} from "../src/domain/stats.js";

describe("stats", () => {
  it("applies win and loss", () => {
    let stats = emptyClassicStats();
    stats = applyClassicResult(stats, {
      outcome: "won",
      attempts: 3,
      elapsedMs: 12_000,
    });
    stats = applyClassicResult(stats, {
      outcome: "lost",
      attempts: 5,
      elapsedMs: 30_000,
    });

    assert.equal(stats.played, 2);
    assert.equal(stats.wins, 1);
    assert.equal(stats.losses, 1);
    assert.deepEqual(stats.attemptDist, [0, 0, 1, 0, 0]);
    assert.equal(stats.totalWinTimeMs, 12_000);
    assert.equal(winRate(stats), 0.5);
    assert.equal(averageWinTimeMs(stats), 12_000);
  });

  it("formats duration", () => {
    assert.equal(formatDuration(4500), "4s");
    assert.equal(formatDuration(65_000), "1m 05s");
  });
});
