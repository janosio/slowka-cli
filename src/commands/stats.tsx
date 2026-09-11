import { render } from "ink";
import { loadStats } from "../infra/storage.js";
import { StatsScreen } from "../ui/stats-screen.js";

export async function runStats(): Promise<void> {
  const file = await loadStats();
  const instance = render(<StatsScreen classic={file.classic} />);
  // Stats is a static view — exit after one frame so the command returns.
  instance.unmount();
}
