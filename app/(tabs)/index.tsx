import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AdSlot } from '@/src/ads/AdSlot';
import { BannerAdView } from '@/src/ads/BannerAdView';
import { MoodPicker } from '@/src/components/MoodPicker';
import { Screen } from '@/src/components/Screen';
import { TaskList } from '@/src/components/TaskList';
import { useApp } from '@/src/context/AppProvider';
import { MoodValue, Task } from '@/src/lib/dayModel';

export default function TodayScreen() {
  const { ready, today, streak, showAds, palette, saveToday, updateTask } = useApp();
  const [drafts, setDrafts] = useState<[string, string, string] | null>(null);
  const texts = drafts ?? [today.tasks[0].text, today.tasks[1].text, today.tasks[2].text];

  const tasksForUi = useMemo(
    () =>
      today.tasks.map((task, index) => ({ ...task, text: texts[index] })) as [Task, Task, Task],
    [today.tasks, texts],
  );

  return (
    <Screen ready={ready} palette={palette}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={[styles.brand, { color: palette.accent }]}>BeHappy</Text>
          <Text style={[styles.streak, { color: palette.muted }]}>
            {streak === 0 ? 'Start a streak today' : `${streak}-day streak`}
          </Text>

          <View style={styles.block}>
            <MoodPicker
              value={today.mood}
              onChange={(mood: MoodValue) => {
                void saveToday({ mood });
              }}
              palette={palette}
            />
          </View>

          <View style={styles.block}>
            <TaskList
              tasks={tasksForUi}
              palette={palette}
              onChangeText={(slot, text) => {
                setDrafts((prev) => {
                  const base = prev ?? [
                    today.tasks[0].text,
                    today.tasks[1].text,
                    today.tasks[2].text,
                  ];
                  const next: [string, string, string] = [base[0], base[1], base[2]];
                  next[slot] = text;
                  return next;
                });
                void updateTask(slot, { text });
              }}
              onToggle={(slot) => {
                void updateTask(slot, { done: !today.tasks[slot].done });
              }}
            />
          </View>

          <View style={styles.block}>
            <Text style={[styles.heading, { color: palette.text }]}>What went well?</Text>
            <TextInput
              value={today.wentWell}
              onChangeText={(wentWell) => {
                void saveToday({ wentWell });
              }}
              placeholder="One line, whenever you’re ready"
              placeholderTextColor={palette.muted}
              multiline
              style={[
                styles.note,
                { color: palette.text, backgroundColor: palette.card, borderColor: palette.border },
              ]}
            />
          </View>
        </ScrollView>
        <AdSlot showAds={showAds}>
          <BannerAdView showAds={showAds} />
        </AdSlot>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20, paddingBottom: 32 },
  brand: { fontSize: 32, fontWeight: '800' },
  streak: { marginTop: 4, marginBottom: 20, fontSize: 16 },
  block: { marginBottom: 24 },
  heading: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  note: {
    minHeight: 88,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
});
