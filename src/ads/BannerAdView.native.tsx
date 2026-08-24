import { StyleSheet, Text, View } from 'react-native';

import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

import { isAdsSdkAvailable } from './availability';
import { bannerUnitId, PRODUCTION_BANNER_UNIT_ID } from './config';

type Props = {
  showAds: boolean;
};

export function BannerAdView({ showAds }: Props) {
  if (!showAds) {
    return null;
  }

  if (!isAdsSdkAvailable()) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      return (
        <View style={styles.placeholder} testID="ad-placeholder">
          <Text style={styles.placeholderText}>Test ad (SDK needs a dev build)</Text>
        </View>
      );
    }
    return null;
  }

  const unitId = TestIds?.BANNER ?? bannerUnitId(PRODUCTION_BANNER_UNIT_ID);

  return (
    <View style={styles.wrap} testID="ad-banner">
      <BannerAd unitId={unitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    width: '100%',
  },
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
