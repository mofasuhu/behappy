import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import {
  ReminderPlan,
  buildReminderPlan,
  dailyTriggerPayload,
  testReminderTrigger,
} from '@/src/lib/reminders';
import { AppSettings } from '@/src/lib/settings';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function ensureNotificationPermission(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted || existing.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted || asked.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
}

export async function syncDailyReminders(settings: AppSettings): Promise<ReminderPlan[]> {
  const allowed = await ensureNotificationPermission();
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!allowed) {
    return [];
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Daily reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const plans = buildReminderPlan({
    morning: settings.morningTime,
    eveningEnabled: settings.eveningEnabled,
    evening: settings.eveningTime,
  });

  for (const plan of plans) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: plan.title,
        body: plan.body,
      },
      trigger: {
        ...dailyTriggerPayload(plan.time),
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        channelId: 'reminders',
      },
    });
  }

  return plans;
}

export async function scheduleTestReminder(minutesFromNow = 1): Promise<void> {
  const allowed = await ensureNotificationPermission();
  if (!allowed) {
    throw new Error('Notifications permission is off');
  }
  await Notifications.scheduleNotificationAsync({
    identifier: 'behappy-test',
    content: {
      title: 'BeHappy test reminder',
      body: 'Local notification scheduling works.',
    },
    trigger: {
      ...testReminderTrigger(minutesFromNow),
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      channelId: 'reminders',
    },
  });
}
