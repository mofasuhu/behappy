import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useApp } from '@/src/context/AppProvider';

export default function NotFoundScreen() {
  const { palette } = useApp();
  return (
    <>
      <Stack.Screen options={{ title: 'Oops' }} />
      <View style={[styles.container, { backgroundColor: palette.background }]}>
        <Text style={[styles.title, { color: palette.text }]}>This screen does not exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={{ color: palette.accent }}>Go to Today</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  link: { marginTop: 16, paddingVertical: 12 },
});
