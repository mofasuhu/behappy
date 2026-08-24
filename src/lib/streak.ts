import { addDays } from './dates';

/**
 * Habit-style streak: if today is logged, count back from today.
 * If today is not logged but yesterday is, the streak is still alive.
 */
export function computeStreak(datesWithCheckin: string[], today: string): number {
  const set = new Set(datesWithCheckin);
  const yesterday = addDays(today, -1);
  if (!set.has(today) && !set.has(yesterday)) {
    return 0;
  }
  let cursor = set.has(today) ? today : yesterday;
  let streak = 0;
  while (set.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}
