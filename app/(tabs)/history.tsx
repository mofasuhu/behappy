import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AdSlot } from '@/src/ads/AdSlot';
import { BannerAdView } from '@/src/ads/BannerAdView';
import { MonthCalendar } from '@/src/components/MonthCalendar';
import { Screen } from '@/src/components/Screen';
import { useApp } from '@/src/context/AppProvider';
import { emptyDay, moodEmoji } from '@/src/lib/dayModel';
import { parseDateKey } from '@/src/lib/dates';

export default function HistoryScreen() {
  const { ready, store, todayKey, showAds, palette } = useApp();
  const initial = parseDateKey(todayKey);
  const [cursor, setCursor] = useState({ year: initial.getFullYear(), month: initial.getMonth() });
  const [selected, setSelected] = useState<string | null>(todayKey);
  const entry = selected ? store[selected] ?? emptyDay(selected) : null;

  const summary = useMemo(() => {
    if (!entry) {
      return null;
    }
    return entry;
  }, [entry]);

  return (
    <Screen ready={ready} palette={palette}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: palette.text }]}>History</Text>
        <MonthCalendar
          year={cursor.year}
          monthIndex={cursor.month}
          store={store}
          selected={selected}
          todayKey={todayKey}
          palette={palette}
          onSelect={setSelected}
          onShiftMonth={(delta) => {
            setCursor((prev) => {
              const date = new Date(prev.year, prev.month + delta, 1);
              return { year: date.getFullYear(), month: date.getMonth() };
            });
          }}
        />
        {summary ? (
          <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
            <Text style={[styles.date, { color: palette.text }]}>
              {summary.date} {moodEmoji(summary.mood)}
            </Text>
            {summary.tasks.map((task) => (
              <Text key={task.slot} style={{ color: palette.muted, marginTop: 6 }}>
                {task.done ? '☑' : '☐'} {task.text || '—'}
              </Text>
            ))}
            {summary.wentWell ? (
              <Text style={{ color: palette.text, marginTop: 10 }}>{summary.wentWell}</Text>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
      <AdSlot showAds={showAds}>
        <BannerAdView showAds={showAds} />
      </AdSlot>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 12 },
  card: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  date: { fontSize: 18, fontWeight: '700' },
});
