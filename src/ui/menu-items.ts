export type AppView = "menu" | "play" | "stats";

export interface MenuItem {
  id: AppView | "quit";
  label: string;
  hint: string;
}

/** Main menu entries — more modes can be added here later. */
export const MENU_ITEMS: readonly MenuItem[] = [
  {
    id: "play",
    label: "Trening 5-literowy",
    hint: "Zgadnij hasło w 5 próbach",
  },
  {
    id: "stats",
    label: "Statystyki",
    hint: "Wyniki lokalnego treningu",
  },
  {
    id: "quit",
    label: "Wyjście",
    hint: "Zamknij Słówka CLI",
  },
] as const;
