import { ScrollView, StyleSheet, Text } from 'react-native';

import { useApp } from '@/src/context/AppProvider';

export default function PrivacyScreen() {
  const { palette } = useApp();
  return (
    <ScrollView contentContainerStyle={[styles.content, { backgroundColor: palette.background }]}>
      <Text style={[styles.title, { color: palette.text }]}>Privacy policy</Text>
      <Text style={[styles.body, { color: palette.text }]}>
        BeHappy stores your mood, tasks, and notes on this device in a local SQLite database. We do not
        create an account and we do not operate a BeHappy server that receives your journal.
      </Text>
      <Text style={[styles.body, { color: palette.text }]}>
        If you use the free version, Google AdMob may collect advertising identifiers and usage data as
        described in Google’s policies. The one-time Remove Ads purchase is processed by Google Play
        Billing. Uninstalling the app deletes on-device data.
      </Text>
      <Text style={[styles.body, { color: palette.muted }]}>Host privacy.html at a public URL for Play Console.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 12 },
  body: { fontSize: 16, lineHeight: 24, marginBottom: 16 },
});
