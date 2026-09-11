/** Enter the terminal alternate screen buffer (isolated from scrollback). */
export function enterAlternateScreen(): void {
  const stdout = process.stdout;
  if (!stdout.isTTY) return;
  stdout.write("\x1b[?1049h\x1b[2J\x1b[H\x1b[?25l");
}

/** Leave alternate screen and restore the cursor. */
export function leaveAlternateScreen(): void {
  const stdout = process.stdout;
  if (!stdout.isTTY) return;
  stdout.write("\x1b[?25h\x1b[?1049l");
}

/** Clear the current screen and move the cursor home. */
export function clearTerminal(): void {
  const stdout = process.stdout;
  if (!stdout.isTTY) return;
  stdout.write("\x1b[2J\x1b[H");
}
