export type ClockTime = { hour: number; minute: number };

export type ReminderId = 'morning' | 'evening' | 'test';

export type ReminderPlan = {
  id: ReminderId;
  title: string;
  body: string;
  time: ClockTime;
};

export function parseClockTime(value: string): ClockTime {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) {
    throw new Error(`Invalid time: ${value}`);
  }
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    throw new Error(`Invalid time: ${value}`);
  }
  return { hour, minute };
}

export function formatClockTime(time: ClockTime): string {
  return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
}

export function stepClockTime(time: ClockTime, field: 'hour' | 'minute', delta: number): ClockTime {
  if (field === 'hour') {
    return { hour: (time.hour + delta + 24) % 24, minute: time.minute };
  }
  return { hour: time.hour, minute: (time.minute + delta + 60) % 60 };
}

export function dailyTriggerPayload(time: ClockTime) {
  return {
    type: 'daily' as const,
    hour: time.hour,
    minute: time.minute,
  };
}

/** One-shot local reminder for emulator testing. */
export function testReminderTrigger(minutesFromNow: number) {
  const seconds = Math.max(1, Math.round(minutesFromNow * 60));
  return {
    type: 'timeInterval' as const,
    seconds,
    repeats: false,
  };
}

export function buildReminderPlan(options: {
  morning: string;
  eveningEnabled: boolean;
  evening: string;
}): ReminderPlan[] {
  const plans: ReminderPlan[] = [
    {
      id: 'morning',
      title: 'Plan your day',
      body: 'Tap your mood and write today’s 3 things.',
      time: parseClockTime(options.morning),
    },
  ];
  if (options.eveningEnabled) {
    plans.push({
      id: 'evening',
      title: 'What went well?',
      body: 'Capture one thing that made today better.',
      time: parseClockTime(options.evening),
    });
  }
  return plans;
}
