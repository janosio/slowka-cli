# slowka-cli

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
npm start -- play
# lub
npx tsx src/index.ts play
```

## Użycie

| Komenda | Opis |
|---------|------|
| `slowka` / `slowka play` | Start treningu (domyślna) |
| `slowka stats` | Lokalne statystyki |

### Skróty w grze

| Klawisz | Akcja |
|---------|--------|
| litery (w tym ąęć…) | Wpisz literę |
| `Enter` | Zatwierdź słowo |
| `Backspace` | Skasuj literę |
| `Esc` | Wyjście |
| `n` | Następna runda (po wygranej/przegranej) |
| `q` | Wyjście (po zakończeniu rundy) |

### Kolory kafelków

- **teal** — litera na właściwym miejscu
- **terracotta** — litera jest w haśle, zła pozycja
- **ciemny** — litery nie ma w haśle

## Statystyki

Zapis: `~/.config/slowka-cli/stats.json` (lub `$XDG_CONFIG_HOME/slowka-cli/`, albo `SLOWKA_CLI_CONFIG_DIR`).

Śledzone: rozegrane, wygrane/przegrane, rozkład prób 1–5, średni czas wygranej.

## Rozwój

```bash
npm test          # testy domeny (node:test)
npm run dev       # tsx bez builda
npm run build     # kompilacja do dist/
```

### Struktura

```
src/
  domain/     # logika gry (bez UI) — tu lądują PR-y z mechaniką
  infra/      # słownik, storage
  ui/         # Ink (React w terminalu)
  commands/   # play / stats
data/         # classic-answers.json, classic-valid.json
tests/        # unit testy domeny
```

Logika gry jest czystymi funkcjami — zmiany reguł i ewaluacji powinny iść z testami w `tests/`.

## Słownik

Listy odpowiedzi i dozwolonych zgadywań pochodzą ze starter setu projektu Słówka (`classic-answers.json` / `classic-valid.json`). Diacrityki są zachowane (`ą` ≠ `a`).

## Licencja

MIT — zobacz [LICENSE](./LICENSE).
