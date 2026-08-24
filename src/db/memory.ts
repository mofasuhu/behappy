import { DayEntry, DayStore, emptyDay, getDay, hasCheckin, upsertDay } from '@/src/lib/dayModel';
import { AppSettings, DEFAULT_SETTINGS } from '@/src/lib/settings';
import { DayRow, TaskRow, entryToRows, rowsToEntry } from '@/src/lib/sqliteMap';

/** In-memory stand-in for SQLite so day save/load can be unit-tested. */
export class MemoryDaysDb {
  days = new Map<string, DayRow>();
  tasks = new Map<string, TaskRow[]>();
  settings: AppSettings = { ...DEFAULT_SETTINGS };

  saveDay(entry: DayEntry): void {
    const { day, tasks } = entryToRows(entry);
    this.days.set(day.date, day);
    this.tasks.set(day.date, tasks);
  }

  loadDay(date: string): DayEntry {
    return rowsToEntry(this.days.get(date) ?? null, this.tasks.get(date) ?? [], date);
  }

  loadAllDays(): DayEntry[] {
    return [...this.days.keys()].sort().map((date) => this.loadDay(date));
  }
}

export function storeFromEntries(entries: DayEntry[]): DayStore {
  return entries.reduce<DayStore>((store, entry) => upsertDay(store, entry), {});
}

export function checkedInDates(store: DayStore): string[] {
  return Object.values(store)
    .filter(hasCheckin)
    .map((entry) => entry.date);
}

export { emptyDay, getDay };
