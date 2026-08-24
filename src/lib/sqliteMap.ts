import { DayEntry, emptyDay, MoodValue } from './dayModel';

export type DayRow = {
  date: string;
  mood: number | null;
  went_well: string;
};

export type TaskRow = {
  date: string;
  slot: number;
  text: string;
  done: number;
};

function asMood(value: number | null): MoodValue | null {
  if (value === 1 || value === 2 || value === 3 || value === 4 || value === 5) {
    return value;
  }
  return null;
}

export function entryToRows(entry: DayEntry): { day: DayRow; tasks: TaskRow[] } {
  return {
    day: {
      date: entry.date,
      mood: entry.mood,
      went_well: entry.wentWell,
    },
    tasks: entry.tasks.map((task) => ({
      date: entry.date,
      slot: task.slot,
      text: task.text,
      done: task.done ? 1 : 0,
    })),
  };
}

export function rowsToEntry(day: DayRow | null, tasks: TaskRow[], date: string): DayEntry {
  const base = emptyDay(date);
  if (!day) {
    return base;
  }
  const next = emptyDay(day.date);
  next.mood = asMood(day.mood);
  next.wentWell = day.went_well ?? '';
  for (const task of tasks) {
    if (task.slot === 0 || task.slot === 1 || task.slot === 2) {
      next.tasks[task.slot] = {
        slot: task.slot,
        text: task.text ?? '',
        done: task.done === 1,
      };
    }
  }
  return next;
}
