import { useCallback, useEffect, useState } from "react";
import { useApp } from "ink";
import type { ClassicStats } from "../domain/types.js";
import type { Dictionary } from "../infra/dictionary.js";
import { loadStats } from "../infra/storage.js";
import { MenuScreen } from "./menu-screen.js";
import type { AppView, MenuItem } from "./menu-items.js";
import { PlayScreen } from "./play-screen.js";
import { StatsScreen } from "./stats-screen.js";

interface AppProps {
  dictionary: Dictionary;
  initialView?: AppView;
  onBeforeRedraw?: () => void;
}

export function App({
  dictionary,
  initialView = "menu",
  onBeforeRedraw,
}: AppProps) {
  const { exit } = useApp();
  const [view, setView] = useState<AppView>(initialView);
  const [menuIndex, setMenuIndex] = useState(0);
  const [classicStats, setClassicStats] = useState<ClassicStats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [statsLoading, setStatsLoading] = useState(initialView === "stats");

  const goTo = useCallback(
    (next: AppView) => {
      onBeforeRedraw?.();
      setView(next);
    },
    [onBeforeRedraw],
  );

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    setClassicStats(null);
    setStatsError(null);
    try {
      const file = await loadStats();
      setClassicStats(file.classic);
    } catch (err) {
      setStatsError(
        err instanceof Error ? err.message : "Nie udało się wczytać statystyk",
      );
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialView === "stats") {
      void fetchStats();
    }
  }, [initialView, fetchStats]);

  const openMenu = useCallback(() => {
    setClassicStats(null);
    setStatsError(null);
    setStatsLoading(false);
    goTo("menu");
  }, [goTo]);

  const openStats = useCallback(async () => {
    goTo("stats");
    await fetchStats();
  }, [goTo, fetchStats]);

  const onConfirm = useCallback(
    (item: MenuItem) => {
      if (item.id === "quit") {
        exit();
        return;
      }
      if (item.id === "play") {
        goTo("play");
        return;
      }
      if (item.id === "stats") {
        void openStats();
      }
    },
    [exit, goTo, openStats],
  );

  if (view === "play") {
    return (
      <PlayScreen
        dictionary={dictionary}
        onExit={openMenu}
        onBeforeRedraw={onBeforeRedraw}
      />
    );
  }

  if (view === "stats") {
    return (
      <StatsScreen
        classic={classicStats}
        error={statsError}
        loading={statsLoading}
        onBack={openMenu}
      />
    );
  }

  return (
    <MenuScreen
      selectedIndex={menuIndex}
      onSelectIndex={setMenuIndex}
      onConfirm={onConfirm}
      onQuit={exit}
    />
  );
}
