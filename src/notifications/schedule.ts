import { Platform } from 'react-native';

import { isExpoGo } from '@/src/ads/availability';
import {
  ReminderPlan,
  buildReminderPlan,
  dailyTriggerPayload,
  testReminderTrigger,
} from '@/src/lib/reminders';
import { AppSettings } from '@/src/lib/settings';

type NotificationsModule = typeof import('expo-notifications');

function loadNotifications(): NotificationsModule | null {
  // SDK 53+ Expo Go Android throws on import (remote push was removed).
  if (isExpoGo() && Platform.OS === 'android') {
    return null;
  }
  try {
    return require('expo-notifications') as NotificationsModule;
  } catch {
    return null;
  }
}

function configureHandler(Notifications: NotificationsModule) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function ensureNotificationPermission(): Promise<boolean> {
  const Notifications = loadNotifications();
  if (!Notifications) {
    return false;
  }
  configureHandler(Notifications);
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted || existing.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted || asked.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
}

export async function syncDailyReminders(settings: AppSettings): Promise<ReminderPlan[]> {
  const Notifications = loadNotifications();
  if (!Notifications) {
    return [];
  }
  configureHandler(Notifications);
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
  const Notifications = loadNotifications();
  if (!Notifications) {
    throw new Error(
      'Expo Go on Android cannot schedule notifications (SDK 53+). Mood and tasks still work. Reminders need a later development build.',
    );
  }
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
