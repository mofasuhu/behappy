import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MOODS, MoodValue } from '@/src/lib/dayModel';
import { Palette } from '@/src/theme/palette';

type Props = {
  value: MoodValue | null;
  onChange: (mood: MoodValue) => void;
  palette: Palette;
};

export function MoodPicker({ value, onChange, palette }: Props) {
  return (
    <View>
      <Text style={[styles.heading, { color: palette.text }]}>How are you today?</Text>
      <View style={styles.row}>
        {MOODS.map((mood) => {
          const selected = value === mood.value;
          return (
            <Pressable
              key={mood.value}
              accessibilityRole="button"
              accessibilityLabel={mood.label}
              onPress={() => onChange(mood.value)}
              style={[
                styles.mood,
                {
                  backgroundColor: selected ? palette.accentSoft : palette.card,
                  borderColor: selected ? palette.accent : palette.border,
                },
              ]}>
              <Text style={styles.emoji}>{mood.emoji}</Text>
              <Text style={[styles.label, { color: palette.muted }]}>{mood.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  mood: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 2,
  },
  emoji: {
    fontSize: 26,
  },
  label: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
});
