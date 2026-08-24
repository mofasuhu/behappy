import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ClockTime, formatClockTime, stepClockTime } from '@/src/lib/reminders';
import { Palette } from '@/src/theme/palette';

type Props = {
  time: ClockTime;
  onChange: (time: ClockTime) => void;
  palette: Palette;
};

export function TimeStepper({ time, onChange, palette }: Props) {
  return (
    <View style={styles.row}>
      <Stepper
        label="Hour"
        value={String(time.hour).padStart(2, '0')}
        onMinus={() => onChange(stepClockTime(time, 'hour', -1))}
        onPlus={() => onChange(stepClockTime(time, 'hour', 1))}
        palette={palette}
      />
      <Text style={[styles.colon, { color: palette.text }]}>:</Text>
      <Stepper
        label="Min"
        value={String(time.minute).padStart(2, '0')}
        onMinus={() => onChange(stepClockTime(time, 'minute', -5))}
        onPlus={() => onChange(stepClockTime(time, 'minute', 5))}
        palette={palette}
      />
      <Text style={[styles.preview, { color: palette.muted }]}>{formatClockTime(time)}</Text>
    </View>
  );
}

function Stepper({
  label,
  value,
  onMinus,
  onPlus,
  palette,
}: {
  label: string;
  value: string;
  onMinus: () => void;
  onPlus: () => void;
  palette: Palette;
}) {
  return (
    <View style={styles.stepper}>
      <Text style={[styles.small, { color: palette.muted }]}>{label}</Text>
      <View style={styles.controls}>
        <Pressable onPress={onMinus} style={[styles.btn, { borderColor: palette.border }]}>
          <Text style={{ color: palette.text, fontSize: 18 }}>−</Text>
        </Pressable>
        <Text style={[styles.value, { color: palette.text }]}>{value}</Text>
        <Pressable onPress={onPlus} style={[styles.btn, { borderColor: palette.border }]}>
          <Text style={{ color: palette.text, fontSize: 18 }}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  colon: {
    fontSize: 22,
    fontWeight: '700',
    paddingBottom: 8,
  },
  preview: {
    marginLeft: 8,
    paddingBottom: 10,
    fontWeight: '600',
  },
  stepper: {
    alignItems: 'center',
  },
  small: {
    fontSize: 11,
    marginBottom: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    width: 28,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
});
