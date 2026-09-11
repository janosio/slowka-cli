# AGENTS.md — wytyczne dla agentów i contributorów

Ten plik obowiązuje **każdego** agenta AI oraz człowieka pracującego w `slowka-cli`.
Czytaj go przed większą zmianą kodu.

## Wersjonowanie i dokumentacja (obowiązkowe)

1. **Źródło prawdy wersji** to wyłącznie [`package.json`](./package.json) → pole `"version"`.
2. Przy **każdej** zmianie `"version"` w `package.json` musisz **w tej samej zmianie**:
   - zaktualizować [`CHANGELOG.md`](./CHANGELOG.md) — nowa sekcja `## [X.Y.Z] - YYYY-MM-DD` na górze (format [Keep a Changelog](https://keepachangelog.com/));
   - zaktualizować linię **Wersja** na górze [`README.md`](./README.md), żeby pokazywała tę samą wersję;
   - upewnić się, że CLI `--version` bierze wersję z `package.json` przez `getPackageVersion()` w [`src/infra/version.ts`](./src/infra/version.ts) (**nie** hardcoduj wersji w `src/index.ts`).
3. Nie bumpuj wersji „przy okazji” bez wpisu w changelogu. Nie zostawiaj changelogu bez bumpa, jeśli to świadome wydanie.
4. SemVer w skrócie:
   - **patch** (`0.2.1`) — poprawki bugów, docs, bez zmiany API/CLI
   - **minor** (`0.3.0`) — nowe funkcje wstecznie kompatybilne (np. nowa pozycja menu)
   - **major** (`1.0.0`) — breaking changes CLI / formatu `stats.json`

## Testy (obowiązkowe)

1. Logika gry i statystyk żyje w `src/domain/`. **Każda** zmiana reguł, ewaluacji, normalizacji lub stats **musi** mieć zaktualizowane lub nowe testy w `tests/`.
2. Po zmianach domeny uruchom: `npm test` (oraz `npm run build`, jeśli ruszasz TypeScript publiczny / UI kompilowany).
3. Nie merguj / nie kończ zadania ze czerwonymi testami.
4. UI (Ink) nie wymaga pełnych testów e2e na start, ale:
   - nie przenoś logiki gry do komponentów UI — trzymaj ją w `domain/`;
   - jeśli dodajesz czystą funkcję pomocniczą (np. formatowanie menu), rozważ test jednostkowy.

## Architektura

```
domain/   → czysta logika (testowana)
infra/    → I/O (słownik, pliki)
ui/       → Ink (menu, play, stats, App)
commands/ → entrypointy commander / render
```

- Nowe tryby gry: najpierw `domain/` + testy, potem pozycja w `ui/menu-items.ts` i ekran w `ui/`.
- Statystyki: schemat w `domain/types.ts` + migracja / wersja pliku w `infra/storage.ts` przy breaking change formatu.

## Checklist przed zakończeniem zadania

- [ ] `npm test` przechodzi
- [ ] `npm run build` przechodzi (gdy zmieniano `src/`)
- [ ] Jeśli bump wersji: `package.json` = `CHANGELOG.md` = README (linia Wersja); `slowka --version` pokazuje tę samą wartość
- [ ] README opisuje nowe komendy / skróty klawiszowe, jeśli je dodałeś
- [ ] Brak sekretów w commitach; statystyki lokalne zostają poza repo

## Czego nie robić

- Nie edytuj planów użytkownika w `.cursor/plans/` bez prośby.
- Nie commituj `node_modules/` ani `dist/` jeśli nie jest to wymagane workflow (dist jest budowany lokalnie / przy publish).
- Nie łam polskiego alfabetu: `ą` ≠ `a` (normalizacja `pl-PL`).
