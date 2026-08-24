import { StyleSheet, Text, View } from 'react-native';

type Props = {
  showAds: boolean;
};

/** Web / Expo Go fallback: never load the native ads SDK. */
export function BannerAdView({ showAds }: Props) {
  if (!showAds || (typeof __DEV__ !== 'undefined' && !__DEV__)) {
    return null;
  }
  return (
    <View style={styles.placeholder} testID="ad-placeholder">
      <Text style={styles.placeholderText}>Test ad (Android/iOS build)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    height: 50,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#E8D9C0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#8A7462',
    fontSize: 12,
  },
});
