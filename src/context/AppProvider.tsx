import { DayEntry, DayStore, Task, emptyDay, hasCheckin, upsertDay } from '@/src/lib/dayModel';
import { computeStreak } from '@/src/lib/streak';
import { localDateKey } from '@/src/lib/dates';
import { AppSettings, DEFAULT_SETTINGS } from '@/src/lib/settings';
import { shouldShowAds } from '@/src/lib/adsGate';
import { Palette, darkPalette, lightPalette } from '@/src/theme/palette';
import { loadAllDays, loadSettings, saveDay as persistDay, saveSettings } from '@/src/db/repository';
import { requestAdsConsent } from '@/src/ads/consent';
import { listenForRemoveAdsPurchase } from '@/src/iap/purchases';
import { syncDailyReminders } from '@/src/notifications/schedule';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useColorScheme } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

type AppContextValue = {
  ready: boolean;
  todayKey: string;
  today: DayEntry;
  store: DayStore;
  settings: AppSettings;
  streak: number;
  showAds: boolean;
  palette: Palette;
  resolvedScheme: 'light' | 'dark';
  saveToday: (patch: Partial<DayEntry>) => Promise<void>;
  updateTask: (slot: Task['slot'], patch: Partial<Task>) => Promise<void>;
  patchSettings: (patch: Partial<AppSettings>) => Promise<void>;
  markAdsRemoved: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const systemScheme = useColorScheme();
  const [ready, setReady] = useState(false);
  const [todayKey, setTodayKey] = useState(localDateKey());
  const [store, setStore] = useState<DayStore>({});
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const refresh = useCallback(async () => {
    const [entries, loaded] = await Promise.all([loadAllDays(db), loadSettings(db)]);
    const next: DayStore = {};
    for (const entry of entries) {
      Object.assign(next, upsertDay(next, entry));
    }
    setStore(next);
    setSettings(loaded);
    setTodayKey(localDateKey());
    setReady(true);
  }, [db]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!ready) {
      return;
    }
    void requestAdsConsent(false).catch(() => {});
  }, [ready]);

  useEffect(() => {
    if (!ready) {
      return;
    }
    void syncDailyReminders(settings).catch(() => {});
  }, [ready, settings.morningTime, settings.eveningEnabled, settings.eveningTime]);

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    return listenForRemoveAdsPurchase(() => {
      void (async () => {
        const next = { ...settingsRef.current, adsRemoved: true };
        setSettings(next);
        await saveSettings(db, next);
      })();
    });
  }, [db]);

  const persistSettings = useCallback(
    async (next: AppSettings) => {
      setSettings(next);
      await saveSettings(db, next);
    },
    [db],
  );

  const writeDay = useCallback(
    async (entry: DayEntry) => {
      setStore((prev) => upsertDay(prev, entry));
      await persistDay(db, entry);
    },
    [db],
  );

  const today = store[todayKey] ?? emptyDay(todayKey);
  const streak = useMemo(
    () => computeStreak(Object.values(store).filter(hasCheckin).map((entry) => entry.date), todayKey),
    [store, todayKey],
  );
  const showAds = shouldShowAds(settings.adsRemoved, settings.simulatePurchased);
  const resolvedScheme: 'light' | 'dark' =
    settings.theme === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : settings.theme;
  const palette = resolvedScheme === 'dark' ? darkPalette : lightPalette;

  const value = useMemo<AppContextValue>(
    () => ({
      ready,
      todayKey,
      today,
      store,
      settings,
      streak,
      showAds,
      palette,
      resolvedScheme,
      saveToday: async (patch) => {
        await writeDay({ ...today, ...patch, date: todayKey, tasks: patch.tasks ?? today.tasks });
      },
      updateTask: async (slot, patch) => {
        const tasks = today.tasks.map((task) => (task.slot === slot ? { ...task, ...patch } : task)) as DayEntry['tasks'];
        await writeDay({ ...today, tasks });
      },
      patchSettings: async (patch) => {
        await persistSettings({ ...settings, ...patch });
      },
      markAdsRemoved: async () => {
        await persistSettings({ ...settings, adsRemoved: true });
      },
    }),
    [ready, todayKey, today, store, settings, streak, showAds, palette, resolvedScheme, writeDay, persistSettings],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
