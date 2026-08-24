import { ReactNode } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Link } from 'expo-router';

import { isAdsSdkAvailable } from '@/src/ads/availability';
import { showConsentFormForDebug } from '@/src/ads/consent';
import { Screen } from '@/src/components/Screen';
import { TimeStepper } from '@/src/components/TimeStepper';
import { useApp } from '@/src/context/AppProvider';
import { buyRemoveAds, restoreRemoveAds } from '@/src/iap/purchases';
import { formatClockTime, parseClockTime } from '@/src/lib/reminders';
import { ThemePreference } from '@/src/lib/settings';
import { scheduleTestReminder } from '@/src/notifications/schedule';
import { Palette } from '@/src/theme/palette';

export default function SettingsScreen() {
  const { ready, settings, palette, patchSettings, markAdsRemoved } = useApp();
  const isDev = typeof __DEV__ !== 'undefined' && __DEV__;

  return (
    <Screen ready={ready} palette={palette}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: palette.text }]}>Settings</Text>

        <Section title="Reminders" palette={palette}>
          <Text style={[styles.label, { color: palette.muted }]}>Morning plan</Text>
          <TimeStepper
            time={parseClockTime(settings.morningTime)}
            palette={palette}
            onChange={(time) => {
              void patchSettings({ morningTime: formatClockTime(time) });
            }}
          />
          <View style={styles.switchRow}>
            <Text style={{ color: palette.text, fontWeight: '600' }}>Evening “what went well”</Text>
            <Switch
              value={settings.eveningEnabled}
              onValueChange={(eveningEnabled) => {
                void patchSettings({ eveningEnabled });
              }}
            />
          </View>
          {settings.eveningEnabled ? (
            <TimeStepper
              time={parseClockTime(settings.eveningTime)}
              palette={palette}
              onChange={(time) => {
                void patchSettings({ eveningTime: formatClockTime(time) });
              }}
            />
          ) : null}
          <Button
            label="Send test reminder in 1 minute"
            palette={palette}
            onPress={async () => {
              try {
                await scheduleTestReminder(1);
                Alert.alert('Scheduled', 'You should see a test notification in about a minute.');
              } catch (error) {
                Alert.alert('Reminders', error instanceof Error ? error.message : 'Could not schedule');
              }
            }}
          />
        </Section>

        <Section title="Appearance" palette={palette}>
          {(['system', 'light', 'dark'] as ThemePreference[]).map((theme) => (
            <Pressable
              key={theme}
              onPress={() => {
                void patchSettings({ theme });
              }}
              style={[
                styles.choice,
                {
                  borderColor: settings.theme === theme ? palette.accent : palette.border,
                  backgroundColor: settings.theme === theme ? palette.accentSoft : palette.card,
                },
              ]}>
              <Text style={{ color: palette.text, textTransform: 'capitalize' }}>{theme}</Text>
            </Pressable>
          ))}
        </Section>

        <Section title="Ads" palette={palette}>
          <Text style={{ color: palette.muted, marginBottom: 12 }}>
            BeHappy is free. The only paid option is a one-time Remove Ads purchase. Every feature stays
            unlocked.
          </Text>
          {settings.adsRemoved || settings.simulatePurchased ? (
            <Text style={{ color: palette.success, fontWeight: '700' }}>Ads are off on this device.</Text>
          ) : (
            <Button
              label="Remove Ads (one-time)"
              palette={palette}
              primary
              onPress={async () => {
                const result = await buyRemoveAds();
                if (result === 'ok') {
                  Alert.alert('Thanks', 'If the store confirms, ads will disappear automatically.');
                }
              }}
            />
          )}
          <Button
            label="Restore purchases"
            palette={palette}
            onPress={async () => {
              const result = await restoreRemoveAds();
              if (result === 'owned') {
                await markAdsRemoved();
                Alert.alert('Restored', 'Remove Ads is active again.');
              } else if (result === 'none') {
                Alert.alert('Nothing to restore', 'No Remove Ads purchase was found for this account.');
              }
            }}
          />
          {isDev ? (
            <View style={styles.switchRow}>
              <Text style={{ color: palette.text, flex: 1 }}>Simulate Remove Ads (__DEV__)</Text>
              <Switch
                value={settings.simulatePurchased}
                onValueChange={(simulatePurchased) => {
                  void patchSettings({ simulatePurchased });
                }}
              />
            </View>
          ) : null}
          {isDev && isAdsSdkAvailable() ? (
            <Button
              label="Show UMP consent form"
              palette={palette}
              onPress={async () => {
                const status = await showConsentFormForDebug();
                Alert.alert('Consent', status);
              }}
            />
          ) : null}
        </Section>

        <Section title="Privacy" palette={palette}>
          <Link href="/privacy" asChild>
            <Pressable>
              <Text style={{ color: palette.accent, fontWeight: '700' }}>Read privacy policy</Text>
            </Pressable>
          </Link>
        </Section>
      </ScrollView>
    </Screen>
  );
}

function Section({
  title,
  children,
  palette,
}: {
  title: string;
  children: ReactNode;
  palette: Palette;
}) {
  return (
    <View style={[styles.section, { backgroundColor: palette.card, borderColor: palette.border }]}>
      <Text style={[styles.sectionTitle, { color: palette.text }]}>{title}</Text>
      {children}
    </View>
  );
}

function Button({
  label,
  onPress,
  palette,
  primary,
}: {
  label: string;
  onPress: () => void;
  palette: Palette;
  primary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: primary ? palette.accent : palette.accentSoft,
        },
      ]}>
      <Text style={{ color: primary ? '#fff' : palette.text, fontWeight: '700', textAlign: 'center' }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 12 },
  section: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    gap: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  label: { fontWeight: '600' },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  choice: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginTop: 4,
  },
});
