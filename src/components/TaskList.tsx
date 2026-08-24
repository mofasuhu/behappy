import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Task } from '@/src/lib/dayModel';
import { Palette } from '@/src/theme/palette';

type Props = {
  tasks: [Task, Task, Task];
  onChangeText: (slot: Task['slot'], text: string) => void;
  onToggle: (slot: Task['slot']) => void;
  palette: Palette;
};

export function TaskList({ tasks, onChangeText, onToggle, palette }: Props) {
  return (
    <View>
      <Text style={[styles.heading, { color: palette.text }]}>Today’s 3 things</Text>
      {tasks.map((task, index) => (
        <View
          key={task.slot}
          style={[styles.row, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: task.done }}
            onPress={() => onToggle(task.slot)}
            style={[
              styles.check,
              {
                borderColor: task.done ? palette.success : palette.border,
                backgroundColor: task.done ? palette.success : 'transparent',
              },
            ]}>
            <Text style={styles.checkMark}>{task.done ? '✓' : ''}</Text>
          </Pressable>
          <TextInput
            value={task.text}
            onChangeText={(text) => onChangeText(task.slot, text)}
            placeholder={`Thing ${index + 1}`}
            placeholderTextColor={palette.muted}
            style={[styles.input, { color: palette.text }]}
          />
        </View>
      ))}
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
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkMark: {
    color: '#fff',
    fontWeight: '700',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
});
