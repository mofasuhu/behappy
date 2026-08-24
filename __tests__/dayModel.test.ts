import { emptyDay, getDay, hasCheckin, upsertDay } from '@/src/lib/dayModel';
import { entryToRows, rowsToEntry } from '@/src/lib/sqliteMap';
import { MemoryDaysDb } from '@/src/db/memory';

describe('day model save/load', () => {
  it('round-trips through sqlite row mapping', () => {
    const entry = emptyDay('2026-08-21');
    entry.mood = 4;
    entry.wentWell = 'Walked outside';
    entry.tasks[0] = { slot: 0, text: 'Ship BeHappy', done: true };
    entry.tasks[1] = { slot: 1, text: 'Walk', done: false };

    const { day, tasks } = entryToRows(entry);
    const loaded = rowsToEntry(day, tasks, '2026-08-21');
    expect(loaded).toEqual(entry);
    expect(hasCheckin(loaded)).toBe(true);
  });

  it('returns an empty day when no row exists', () => {
    expect(rowsToEntry(null, [], '2026-08-01')).toEqual(emptyDay('2026-08-01'));
    expect(hasCheckin(emptyDay('2026-08-01'))).toBe(false);
  });

  it('saves and loads via the in-memory sqlite stand-in', () => {
    const db = new MemoryDaysDb();
    const entry = emptyDay('2026-08-20');
    entry.mood = 5;
    entry.tasks[2] = { slot: 2, text: 'Call mom', done: true };
    db.saveDay(entry);
    expect(db.loadDay('2026-08-20')).toEqual(entry);
    expect(db.loadDay('2026-08-21')).toEqual(emptyDay('2026-08-21'));
    expect(db.loadAllDays()).toHaveLength(1);
  });

  it('upserts into a store without mutating the previous object', () => {
    const first = upsertDay({}, emptyDay('2026-08-21'));
    const updated = emptyDay('2026-08-21');
    updated.mood = 3;
    const second = upsertDay(first, updated);
    expect(getDay(first, '2026-08-21').mood).toBeNull();
    expect(getDay(second, '2026-08-21').mood).toBe(3);
  });
});
