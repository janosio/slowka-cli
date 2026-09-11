import { Command } from "commander";
import { runPlay } from "./commands/play.js";
import { runStats } from "./commands/stats.js";

const program = new Command();

program
  .name("slowka")
  .description("Trening 5-literowych słów polskich w terminalu")
  .version("0.1.0");

program
  .command("play", { isDefault: true })
  .description("Rozpocznij trening (domyślna komenda)")
  .action(async () => {
    await runPlay();
  });

program
  .command("stats")
  .description("Pokaż lokalne statystyki treningu")
  .action(async () => {
    await runStats();
  });

await program.parseAsync(process.argv);
