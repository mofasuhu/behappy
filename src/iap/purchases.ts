import { Alert, Platform } from 'react-native';

import { REMOVE_ADS_SKU, purchaseOwnsRemoveAds } from './sku';

export { REMOVE_ADS_SKU, purchaseOwnsRemoveAds };

export async function buyRemoveAds(): Promise<'ok' | 'unavailable' | 'error'> {
  Alert.alert(
    'Store not available',
    Platform.OS === 'web'
      ? 'Purchases are not available on web. Use the Android app.'
      : 'Google Play Billing needs a development or production build. In Expo Go, use Simulate Remove Ads in Settings.',
  );
  return 'unavailable';
}

export async function restoreRemoveAds(): Promise<'owned' | 'none' | 'skipped' | 'error'> {
  Alert.alert(
    'Restore',
    Platform.OS === 'web'
      ? 'Purchases are not available on web.'
      : 'Restore needs a Play/App Store build. In development, use Simulate Remove Ads.',
  );
  return 'skipped';
}

export function listenForRemoveAdsPurchase(_onOwned: () => void): () => void {
  return () => {};
}
