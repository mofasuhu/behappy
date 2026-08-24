export type ThemePreference = 'system' | 'light' | 'dark';

export type AppSettings = {
  adsRemoved: boolean;
  simulatePurchased: boolean;
  morningTime: string;
  eveningEnabled: boolean;
  eveningTime: string;
  theme: ThemePreference;
};

export const DEFAULT_SETTINGS: AppSettings = {
  adsRemoved: false,
  simulatePurchased: false,
  morningTime: '08:00',
  eveningEnabled: true,
  eveningTime: '21:00',
  theme: 'system',
};

function boolFrom(value: string | undefined, fallback: boolean): boolean {
  if (value == null) {
    return fallback;
  }
  return value === '1' || value === 'true';
}

export function settingsFromMap(map: Record<string, string>): AppSettings {
  const theme = map.theme;
  return {
    adsRemoved: boolFrom(map.ads_removed, DEFAULT_SETTINGS.adsRemoved),
    simulatePurchased: boolFrom(map.simulate_purchased, DEFAULT_SETTINGS.simulatePurchased),
    morningTime: map.morning_time || DEFAULT_SETTINGS.morningTime,
    eveningEnabled: boolFrom(map.evening_enabled, DEFAULT_SETTINGS.eveningEnabled),
    eveningTime: map.evening_time || DEFAULT_SETTINGS.eveningTime,
    theme: theme === 'light' || theme === 'dark' || theme === 'system' ? theme : DEFAULT_SETTINGS.theme,
  };
}

export function settingsToMap(settings: AppSettings): Record<string, string> {
  return {
    ads_removed: settings.adsRemoved ? '1' : '0',
    simulate_purchased: settings.simulatePurchased ? '1' : '0',
    morning_time: settings.morningTime,
    evening_enabled: settings.eveningEnabled ? '1' : '0',
    evening_time: settings.eveningTime,
    theme: settings.theme,
  };
}
