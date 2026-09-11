import { Command } from "commander";
import { runKeysProbe } from "./commands/keys.js";
import { runPlay } from "./commands/play.js";
import { runMenu, runStats } from "./commands/stats.js";
import { getPackageVersion } from "./infra/version.js";

const program = new Command();

program
  .name("slowka")
  .description("Trening 5-literowych słów polskich w terminalu")
  .version(getPackageVersion());

program
  .command("menu", { isDefault: true })
  .description("Menu główne — wybór trybu i statystyk")
  .action(async () => {
    await runMenu();
  });

program
  .command("play")
  .description("Od razu rozpocznij trening 5-literowy")
  .action(async () => {
    await runPlay();
  });

program
  .command("stats")
  .description("Od razu pokaż lokalne statystyki")
  .action(async () => {
    await runStats();
  });

program
  .command("keys")
  .description("Sonda klawiatury — pokaż surowe eventy (diagnoza ż / diakrytyków)")
  .action(async () => {
    await runKeysProbe();
  });

await program.parseAsync(process.argv);
