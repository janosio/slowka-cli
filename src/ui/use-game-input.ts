import { useCallback, useEffect, useRef } from "react";
import { useInput, type Key } from "ink";
import { resolveTypedLetter, type KeyModifiers } from "../domain/normalize.js";

/** Esc alone vs Option-as-Meta (Esc then letter as two chunks). */
export const ESCAPE_META_MS = 250;

export interface GameKeyHandlers {
  onEscape: () => void;
  onEnter: () => void;
  onBackspace: () => void;
  onLetter: (letter: string) => void;
  /** Extra keys when not typing letters (e.g. n/q after round). */
  onRaw?: (input: string, key: Key) => boolean | void;
  isActive?: boolean;
}

/**
 * Ink only strips one leading Esc; some terminals send Esc Esc + letter
 * for Option. Also Esc and the letter often arrive as two readable() chunks.
 */
export function unwrapInput(
  input: string,
  key: Pick<Key, "ctrl" | "meta" | "escape">,
): { text: string; mods: KeyModifiers; loneEscape: boolean } {
  let text = input;
  let meta = Boolean(key.meta);
  while (text.startsWith("\u001B")) {
    meta = true;
    text = text.slice(1);
  }
  const loneEscape = Boolean(key.escape) && text.length === 0;
  return { text, mods: { ctrl: key.ctrl, meta }, loneEscape };
}

export function lettersFromInput(text: string, mods: KeyModifiers): string[] {
  const out: string[] = [];
  for (const ch of text.normalize("NFC")) {
    const letter = resolveTypedLetter(ch, mods);
    if (letter) out.push(letter);
  }
  return out;
}

/**
 * Stable Ink input hook: keeps a single subscription (ref callback) so the
 * second half of Esc+letter is not dropped on re-render, and debounces Esc.
 */
export function useGameInput(handlers: GameKeyHandlers): void {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;
  const pendingEscapeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPendingEscape = useCallback(() => {
    if (pendingEscapeRef.current) {
      clearTimeout(pendingEscapeRef.current);
      pendingEscapeRef.current = null;
    }
  }, []);

  useEffect(() => () => clearPendingEscape(), [clearPendingEscape]);

  const handle = useCallback(
    (input: string, key: Key) => {
      const h = handlersRef.current;

      if (pendingEscapeRef.current) {
        clearPendingEscape();
        if (!key.escape || input) {
          const { text, mods } = unwrapInput(input, { ...key, meta: true });
          if (h.onRaw?.(text, { ...key, meta: true })) return;
          for (const letter of lettersFromInput(text, { ...mods, meta: true })) {
            h.onLetter(letter);
          }
          return;
        }
      }

      const { text, mods, loneEscape } = unwrapInput(input, key);

      if (loneEscape) {
        pendingEscapeRef.current = setTimeout(() => {
          pendingEscapeRef.current = null;
          handlersRef.current.onEscape();
        }, ESCAPE_META_MS);
        return;
      }

      if (key.escape && text.length === 0) {
        h.onEscape();
        return;
      }

      if (h.onRaw?.(text, key)) return;

      if (key.return) {
        h.onEnter();
        return;
      }

      if (key.backspace || key.delete) {
        h.onBackspace();
        return;
      }

      for (const letter of lettersFromInput(text, mods)) {
        h.onLetter(letter);
      }
    },
    [clearPendingEscape],
  );

  useInput(handle, { isActive: handlers.isActive !== false });
}
