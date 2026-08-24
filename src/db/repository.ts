import type { SQLiteDatabase } from 'expo-sqlite';

import { DayEntry } from '@/src/lib/dayModel';
import { AppSettings, DEFAULT_SETTINGS, settingsFromMap, settingsToMap } from '@/src/lib/settings';
import { DayRow, TaskRow, entryToRows, rowsToEntry } from '@/src/lib/sqliteMap';
import { MIGRATION_SQL } from './schema';

export async function migrate(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(MIGRATION_SQL);
}

export async function saveDay(db: SQLiteDatabase, entry: DayEntry): Promise<void> {
  const { day, tasks } = entryToRows(entry);
  await db.runAsync(
    'INSERT OR REPLACE INTO days (date, mood, went_well, updated_at) VALUES (?, ?, ?, ?)',
    day.date,
    day.mood,
    day.went_well,
    new Date().toISOString(),
  );
  for (const task of tasks) {
    await db.runAsync(
      'INSERT OR REPLACE INTO tasks (date, slot, text, done) VALUES (?, ?, ?, ?)',
      task.date,
      task.slot,
      task.text,
      task.done,
    );
  }
}

export async function loadDay(db: SQLiteDatabase, date: string): Promise<DayEntry> {
  const day = await db.getFirstAsync<DayRow>('SELECT date, mood, went_well FROM days WHERE date = ?', date);
  const tasks = await db.getAllAsync<TaskRow>(
    'SELECT date, slot, text, done FROM tasks WHERE date = ? ORDER BY slot',
    date,
  );
  return rowsToEntry(day, tasks, date);
}

export async function loadAllDays(db: SQLiteDatabase): Promise<DayEntry[]> {
  const days = await db.getAllAsync<DayRow>('SELECT date, mood, went_well FROM days ORDER BY date');
  const allTasks = await db.getAllAsync<TaskRow>('SELECT date, slot, text, done FROM tasks ORDER BY date, slot');
  const tasksByDate = new Map<string, TaskRow[]>();
  for (const task of allTasks) {
    const list = tasksByDate.get(task.date) ?? [];
    list.push(task);
    tasksByDate.set(task.date, list);
  }
  return days.map((day) => rowsToEntry(day, tasksByDate.get(day.date) ?? [], day.date));
}

export async function loadSettings(db: SQLiteDatabase): Promise<AppSettings> {
  const rows = await db.getAllAsync<{ key: string; value: string }>('SELECT key, value FROM settings');
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return settingsFromMap(map);
}

export async function saveSettings(db: SQLiteDatabase, settings: AppSettings): Promise<void> {
  const map = settingsToMap(settings);
  for (const [key, value] of Object.entries(map)) {
    await db.runAsync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', key, value);
  }
}

export { DEFAULT_SETTINGS };
