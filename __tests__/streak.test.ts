import { computeStreak } from '@/src/lib/streak';

describe('computeStreak', () => {
  it('counts consecutive days ending today', () => {
    expect(computeStreak(['2026-08-19', '2026-08-20', '2026-08-21'], '2026-08-21')).toBe(3);
  });

  it('keeps the streak alive if today is not logged yet but yesterday is', () => {
    expect(computeStreak(['2026-08-19', '2026-08-20'], '2026-08-21')).toBe(2);
  });

  it('returns 0 when today and yesterday are missing', () => {
    expect(computeStreak(['2026-08-18'], '2026-08-21')).toBe(0);
  });

  it('breaks after a gap even if older days exist', () => {
    expect(computeStreak(['2026-08-10', '2026-08-20', '2026-08-21'], '2026-08-21')).toBe(2);
  });
});
