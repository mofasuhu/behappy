export const MOODS = [
  { value: 1, emoji: '😞', label: 'Low' },
  { value: 2, emoji: '🙁', label: 'Off' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' },
] as const;

export type MoodValue = (typeof MOODS)[number]['value'];

export type Task = {
  slot: 0 | 1 | 2;
  text: string;
  done: boolean;
};

export type DayEntry = {
  date: string;
  mood: MoodValue | null;
  tasks: [Task, Task, Task];
  wentWell: string;
};

export type DayStore = Record<string, DayEntry>;

export function emptyTasks(): [Task, Task, Task] {
  return [
    { slot: 0, text: '', done: false },
    { slot: 1, text: '', done: false },
    { slot: 2, text: '', done: false },
  ];
}

export function emptyDay(date: string): DayEntry {
  return { date, mood: null, tasks: emptyTasks(), wentWell: '' };
}

export function cloneDay(entry: DayEntry): DayEntry {
  return {
    date: entry.date,
    mood: entry.mood,
    wentWell: entry.wentWell,
    tasks: [
      { ...entry.tasks[0] },
      { ...entry.tasks[1] },
      { ...entry.tasks[2] },
    ],
  };
}

export function upsertDay(store: DayStore, entry: DayEntry): DayStore {
  return { ...store, [entry.date]: cloneDay(entry) };
}

export function getDay(store: DayStore, date: string): DayEntry {
  const existing = store[date];
  return existing ? cloneDay(existing) : emptyDay(date);
}

export function hasCheckin(entry: DayEntry): boolean {
  return entry.mood != null || entry.tasks.some((task) => task.text.trim().length > 0);
}

export function moodEmoji(mood: MoodValue | null): string {
  if (mood == null) {
    return '';
  }
  return MOODS.find((item) => item.value === mood)?.emoji ?? '';
}
