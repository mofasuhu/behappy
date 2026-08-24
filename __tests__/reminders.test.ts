import {
  buildReminderPlan,
  dailyTriggerPayload,
  formatClockTime,
  parseClockTime,
  stepClockTime,
  testReminderTrigger,
} from '@/src/lib/reminders';

describe('reminders', () => {
  it('parses and formats HH:mm', () => {
    expect(parseClockTime('08:00')).toEqual({ hour: 8, minute: 0 });
    expect(formatClockTime({ hour: 21, minute: 5 })).toBe('21:05');
  });

  it('rejects invalid times', () => {
    expect(() => parseClockTime('25:00')).toThrow();
    expect(() => parseClockTime('8')).toThrow();
  });

  it('steps hour and minute with wraparound', () => {
    expect(stepClockTime({ hour: 23, minute: 55 }, 'hour', 1)).toEqual({ hour: 0, minute: 55 });
    expect(stepClockTime({ hour: 8, minute: 0 }, 'minute', -5)).toEqual({ hour: 8, minute: 55 });
  });

  it('builds morning and optional evening plans', () => {
    const both = buildReminderPlan({ morning: '08:00', eveningEnabled: true, evening: '21:00' });
    expect(both.map((p) => p.id)).toEqual(['morning', 'evening']);
    expect(dailyTriggerPayload(both[0].time)).toEqual({ type: 'daily', hour: 8, minute: 0 });
    const morningOnly = buildReminderPlan({ morning: '07:30', eveningEnabled: false, evening: '21:00' });
    expect(morningOnly).toHaveLength(1);
  });

  it('builds a one-minute test trigger', () => {
    expect(testReminderTrigger(1)).toEqual({ type: 'timeInterval', seconds: 60, repeats: false });
  });
});
