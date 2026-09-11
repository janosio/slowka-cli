# slowka-cli

**Wersja:** `0.2.0` (źródło prawdy: [`package.json`](./package.json) · historia: [`CHANGELOG.md`](./CHANGELOG.md))

Trening 5-literowych słów polskich w terminalu. Mechanika jak tryb **Trening** w aplikacji [Słówka](https://slowka.codeevo.pl/) (Wordle-like: 5 liter × 5 prób, polskie znaki).

## Wymagania

- Node.js **>= 20**

## Instalacja

```bash
cd slowka-cli
npm install
npm run build
npm link          # opcjonalnie: komenda `slowka` w PATH
```

Uruchomienie bez linkowania:

```bash
npm start
# lub
npx tsx src/index.ts
```

## Użycie

```bash
npm start          # menu główne
npm start -- play  # od razu trening
npm start -- stats # od razu statystyki
```

| Komenda | Opis |
|---------|------|
| `slowka` / `slowka menu` | Menu: trening / statystyki / wyjście |
| `slowka play` | Od razu trening 5-literowy |
| `slowka stats` | Od razu statystyki |

### Menu

| Klawisz | Akcja |
|---------|--------|
| `↑` / `↓` | Wybór pozycji |
| `Enter` | Potwierdź |
| `1`–`3` | Szybki wybór |
| `Esc` / `q` | Wyjście |

### Skróty w grze

| Klawisz | Akcja |
|---------|--------|
| litery (w tym ąęć…) | Wpisz literę |
| `Enter` | Zatwierdź słowo |
| `Backspace` | Skasuj literę |
| `Esc` | Powrót do menu |
| `n` | Następna runda (po wygranej/przegranej) |
| `q` | Powrót do menu (po zakończeniu rundy) |

### Statystyki (widok)

| Klawisz | Akcja |
|---------|--------|
| `Esc` / `Enter` / `q` | Powrót do menu |

### Kolory kafelków i klawiatury

- **teal** — litera na właściwym miejscu
- **terracotta** — litera jest w haśle, zła pozycja
- **ciemny / wyszarzone** — litery nie ma w haśle (użyta)

## Statystyki

Zapis: `~/.config/slowka-cli/stats.json` (lub `$XDG_CONFIG_HOME/slowka-cli/`, albo `SLOWKA_CLI_CONFIG_DIR`).

Śledzone: rozegrane, wygrane/przegrane, rozkład prób 1–5, średni czas wygranej.

## Rozwój

```bash
npm test          # testy domeny (node:test)
npm run dev       # tsx bez builda
npm run build     # kompilacja do dist/
```

Wytyczne dla agentów i contributorów: [`AGENTS.md`](./AGENTS.md).  
Historia wydań: [`CHANGELOG.md`](./CHANGELOG.md).

### Struktura

```
src/
  domain/     # logika gry (bez UI) — tu lądują PR-y z mechaniką
  infra/      # słownik, storage
  ui/         # Ink: menu, gra, statystyki, App shell
  commands/   # menu / play / stats
data/         # classic-answers.json, classic-valid.json
tests/        # unit testy domeny
AGENTS.md     # reguły dla agentów AI / contributorów
CHANGELOG.md  # Keep a Changelog — wersja = package.json
```

Logika gry jest czystymi funkcjami — zmiany reguł i ewaluacji **wymagają** testów w `tests/`.

## Słownik

Listy odpowiedzi i dozwolonych zgadywań pochodzą ze starter setu projektu Słówka (`classic-answers.json` / `classic-valid.json`). Diacrityki są zachowane (`ą` ≠ `a`).

## Licencja

MIT — zobacz [LICENSE](./LICENSE).
