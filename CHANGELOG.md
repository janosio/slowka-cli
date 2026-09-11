# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

**Źródło wersji:** pole `"version"` w [`package.json`](./package.json).  
Każda zmiana wersji w `package.json` **musi** mieć odpowiadającą sekcję w tym pliku.

## [0.2.0] - 2026-09-11

### Added

- Interaktywne menu główne (trening / statystyki / wyjście)
- Nawigacja `↑`/`↓`, Enter, skróty numeryczne `1`–`3`
- Powrót do menu z gry i widoku statystyk (`Esc`)
- `AGENTS.md` — reguły dla agentów i contributorów
- `CHANGELOG.md` (Keep a Changelog); CLI `--version` czyta `package.json`

### Changed

- Domyślna komenda CLI to `menu` (zamiast od razu startu treningu)
- `slowka play` / `slowka stats` nadal dostępne jako skróty bez menu
- Ulepszone odstępy UI (plansza / klawiatura) oraz kolory użytych liter na klawiaturze
- Gra działa w alternate screen; jedna plansza bez stackowania klatek

## [0.1.0] - 2026-09-11

### Added

- Trening 5-literowy (Wordle-like, 5 prób, polskie znaki)
- Słowniki `classic-answers` / `classic-valid` ze starter setu Słówka
- Lokalne statystyki (`~/.config/slowka-cli/stats.json`)
- Komendy `play` i `stats`
- Testy domeny: ewaluacja zgadywania, state machine, stats
- README, MIT LICENSE

[0.2.0]: https://github.com/janosio/slowka-cli/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/janosio/slowka-cli/releases/tag/v0.1.0
