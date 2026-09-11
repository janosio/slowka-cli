import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Text, useApp, useInput } from "ink";
import {
  backspace,
  createClassicState,
  elapsedMs,
  gameResult,
  submitGuess,
  typeLetter,
} from "../domain/classic-game.js";
import {
  applyClassicResult,
  formatDuration,
} from "../domain/stats.js";
import type { ClassicState } from "../domain/types.js";
import type { Dictionary } from "../infra/dictionary.js";
import { updateClassicStats } from "../infra/storage.js";
import { Board } from "./board.js";
import { toastMessage } from "./colors.js";
import { KeyboardHint } from "./keyboard-hint.js";

interface PlayScreenProps {
  dictionary: Dictionary;
  /** Called before replacing the frame (e.g. after Enter) so the parent can erase. */
  onBeforeRedraw?: () => void;
}

function newGame(dictionary: Dictionary): ClassicState {
  return createClassicState({
    answer: dictionary.pickAnswer(),
    now: Date.now(),
  });
}

export function PlayScreen({ dictionary, onBeforeRedraw }: PlayScreenProps) {
  const { exit } = useApp();
  const [state, setState] = useState<ClassicState>(() => newGame(dictionary));
  const [error, setError] = useState<string | null>(null);
  const stateRef = useRef(state);
  const savedRef = useRef(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const replaceState = useCallback(
    (next: ClassicState) => {
      onBeforeRedraw?.();
      stateRef.current = next;
      setState(next);
    },
    [onBeforeRedraw],
  );

  const persistResult = useCallback(async (next: ClassicState) => {
    const result = gameResult(next);
    if (!result || savedRef.current) return;
    savedRef.current = true;
    try {
      await updateClassicStats((classic) => applyClassicResult(classic, result));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nie udało się zapisać statystyk",
      );
    }
  }, []);

  useInput((input, key) => {
    if (key.escape) {
      exit();
      return;
    }

    const current = stateRef.current;

    if (current.phase !== "playing") {
      if (input === "n" || input === "N") {
        savedRef.current = false;
        setError(null);
        replaceState(newGame(dictionary));
        return;
      }
      if (input === "q" || input === "Q") {
        exit();
      }
      return;
    }

    if (key.return) {
      const next = submitGuess(current, dictionary.isValid, Date.now());
      replaceState(next);
      void persistResult(next);
      return;
    }

    if (key.backspace || key.delete) {
      setState((s) => backspace(s));
      return;
    }

    if (input && !key.ctrl && !key.meta) {
      setState((s) => {
        let next = s;
        for (const ch of input) {
          next = typeLetter(next, ch);
        }
        return next;
      });
    }
  });

  const toast = toastMessage(state.toast);
  const elapsed = formatDuration(elapsedMs({ ...state, now: Date.now() }));
  const status =
    toast ??
    (state.phase === "won"
      ? `Brawo! Hasło: ${state.answer.toLocaleUpperCase("pl-PL")} · n = następna · Esc/q = wyjście`
      : state.phase === "lost"
        ? `Koniec. Hasło: ${state.answer.toLocaleUpperCase("pl-PL")} · n = następna · Esc/q = wyjście`
        : error);

  return (
    <Box flexDirection="column" paddingX={1}>
      <Text bold>Słówka CLI — trening (5 liter)</Text>
      <Text dimColor>
        Próba{" "}
        {Math.min(
          state.rows.length + (state.phase === "playing" ? 1 : 0),
          5,
        )}
        /5 · czas {elapsed}
      </Text>
      <Box marginTop={1}>
        <Board state={state} />
      </Box>
      {status ? (
        <Box marginTop={1}>
          <Text
            color={
              toast
                ? "yellow"
                : state.phase === "won"
                  ? "greenBright"
                  : state.phase === "lost"
                    ? "redBright"
                    : "red"
            }
          >
            {status}
          </Text>
        </Box>
      ) : null}
      <Box marginTop={1}>
        <KeyboardHint keyboard={state.keyboard} />
      </Box>
    </Box>
  );
}
