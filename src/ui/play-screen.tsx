import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Text, useApp } from "ink";
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
import { useGameInput } from "./use-game-input.js";

interface PlayScreenProps {
  dictionary: Dictionary;
  /** Leave play view (e.g. back to menu). Defaults to exiting the app. */
  onExit?: () => void;
  /** Called before replacing the frame (e.g. after Enter) so the parent can erase. */
  onBeforeRedraw?: () => void;
}

function newGame(dictionary: Dictionary): ClassicState {
  return createClassicState({
    answer: dictionary.pickAnswer(),
    now: Date.now(),
  });
}

export function PlayScreen({
  dictionary,
  onExit,
  onBeforeRedraw,
}: PlayScreenProps) {
  const { exit } = useApp();
  const leave = onExit ?? exit;
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

  useGameInput({
    onEscape: leave,
    onEnter: () => {
      const current = stateRef.current;
      if (current.phase !== "playing") return;
      const next = submitGuess(current, dictionary.isValid, Date.now());
      replaceState(next);
      void persistResult(next);
    },
    onBackspace: () => {
      if (stateRef.current.phase !== "playing") return;
      setState((s) => backspace(s));
    },
    onLetter: (letter) => {
      if (stateRef.current.phase !== "playing") return;
      setState((s) => typeLetter(s, letter));
    },
    onRaw: (input) => {
      const current = stateRef.current;
      if (current.phase === "playing") return false;
      if (input === "n" || input === "N") {
        savedRef.current = false;
        setError(null);
        replaceState(newGame(dictionary));
        return true;
      }
      if (input === "q" || input === "Q") {
        leave();
        return true;
      }
      return false;
    },
  });

  const toast = toastMessage(state.toast);
  const elapsed = formatDuration(elapsedMs({ ...state, now: Date.now() }));
  const status =
    toast ??
    (state.phase === "won"
      ? `Brawo! Hasło: ${state.answer.toLocaleUpperCase("pl-PL")} · n = następna · Esc = menu`
      : state.phase === "lost"
        ? `Koniec. Hasło: ${state.answer.toLocaleUpperCase("pl-PL")} · n = następna · Esc = menu`
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
