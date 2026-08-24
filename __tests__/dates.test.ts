import { addDays, localDateKey, monthGrid, parseDateKey } from '@/src/lib/dates';

describe('localDateKey', () => {
  it('formats a local calendar date as YYYY-MM-DD', () => {
    expect(localDateKey(new Date(2026, 7, 21, 23, 59))).toBe('2026-08-21');
    expect(localDateKey(new Date(2026, 0, 1, 0, 0))).toBe('2026-01-01');
  });

  it('does not shift the day when parsing back', () => {
    const date = parseDateKey('2026-08-21');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(7);
    expect(date.getDate()).toBe(21);
  });
});

describe('addDays', () => {
  it('crosses month and year boundaries', () => {
    expect(addDays('2026-08-31', 1)).toBe('2026-09-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });
});

describe('monthGrid', () => {
  it('pads to full weeks starting Sunday', () => {
    const cells = monthGrid(2026, 7);
    expect(cells.length % 7).toBe(0);
    expect(cells).toContain('2026-08-01');
    expect(cells).toContain('2026-08-31');
  });
});
