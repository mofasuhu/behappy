import { Pressable, StyleSheet, Text, View } from 'react-native';

import { monthGrid, monthName } from '@/src/lib/dates';
import { DayStore, moodEmoji } from '@/src/lib/dayModel';
import { Palette } from '@/src/theme/palette';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

type Props = {
  year: number;
  monthIndex: number;
  store: DayStore;
  selected: string | null;
  todayKey: string;
  palette: Palette;
  onSelect: (date: string) => void;
  onShiftMonth: (delta: number) => void;
};

export function MonthCalendar({
  year,
  monthIndex,
  store,
  selected,
  todayKey,
  palette,
  onSelect,
  onShiftMonth,
}: Props) {
  const cells = monthGrid(year, monthIndex);
  return (
    <View>
      <View style={styles.header}>
        <Pressable onPress={() => onShiftMonth(-1)} style={styles.nav}>
          <Text style={{ color: palette.accent, fontSize: 22 }}>‹</Text>
        </Pressable>
        <Text style={[styles.title, { color: palette.text }]}>{monthName(year, monthIndex)}</Text>
        <Pressable onPress={() => onShiftMonth(1)} style={styles.nav}>
          <Text style={{ color: palette.accent, fontSize: 22 }}>›</Text>
        </Pressable>
      </View>
      <View style={styles.weekRow}>
        {WEEKDAYS.map((day, index) => (
          <Text key={`${day}-${index}`} style={[styles.weekday, { color: palette.muted }]}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((date, index) => {
          if (!date) {
            return <View key={`empty-${index}`} style={styles.cell} />;
          }
          const entry = store[date];
          const isSelected = selected === date;
          const isToday = date === todayKey;
          return (
            <Pressable
              key={date}
              onPress={() => onSelect(date)}
              style={[
                styles.cell,
                isSelected && { backgroundColor: palette.accentSoft, borderRadius: 12 },
                isToday && { borderColor: palette.accent, borderWidth: 1, borderRadius: 12 },
              ]}>
              <Text style={[styles.dayNum, { color: palette.text }]}>{Number(date.slice(-2))}</Text>
              <Text style={styles.mood}>{moodEmoji(entry?.mood ?? null)}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nav: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekday: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNum: {
    fontSize: 13,
    fontWeight: '600',
  },
  mood: {
    fontSize: 14,
    minHeight: 18,
  },
});
