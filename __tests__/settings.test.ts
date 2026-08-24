import { DEFAULT_SETTINGS, settingsFromMap, settingsToMap } from '@/src/lib/settings';

describe('settings map', () => {
  it('round-trips defaults', () => {
    expect(settingsFromMap(settingsToMap(DEFAULT_SETTINGS))).toEqual(DEFAULT_SETTINGS);
  });

  it('parses stored flags', () => {
    const settings = settingsFromMap({
      ads_removed: '1',
      simulate_purchased: 'true',
      morning_time: '07:15',
      evening_enabled: '0',
      evening_time: '22:00',
      theme: 'dark',
    });
    expect(settings.adsRemoved).toBe(true);
    expect(settings.simulatePurchased).toBe(true);
    expect(settings.eveningEnabled).toBe(false);
    expect(settings.theme).toBe('dark');
    expect(settings.morningTime).toBe('07:15');
  });
});
