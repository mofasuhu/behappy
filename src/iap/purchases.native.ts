import { Alert, Platform } from 'react-native';
import {
  fetchProducts,
  finishTransaction,
  getAvailablePurchases,
  initConnection,
  purchaseUpdatedListener,
  requestPurchase,
  restorePurchases,
} from 'expo-iap';

import { isIapAvailable } from '@/src/ads/availability';
import { REMOVE_ADS_SKU, purchaseOwnsRemoveAds } from './sku';

export { REMOVE_ADS_SKU, purchaseOwnsRemoveAds };

export async function buyRemoveAds(): Promise<'ok' | 'unavailable' | 'error'> {
  if (!isIapAvailable()) {
    Alert.alert(
      'Store not available',
      'Google Play Billing needs a development or production build. In Expo Go, use Simulate Remove Ads in Settings.',
    );
    return 'unavailable';
  }
  try {
    await initConnection();
    await fetchProducts({ skus: [REMOVE_ADS_SKU], type: 'in-app' });
    await requestPurchase({
      request: {
        apple: { sku: REMOVE_ADS_SKU },
        google: { skus: [REMOVE_ADS_SKU] },
      },
      type: 'in-app',
    });
    return 'ok';
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Purchase failed';
    Alert.alert('Purchase', message);
    return 'error';
  }
}

export async function restoreRemoveAds(): Promise<'owned' | 'none' | 'skipped' | 'error'> {
  if (!isIapAvailable()) {
    Alert.alert(
      'Restore',
      Platform.OS === 'web'
        ? 'Purchases are not available on web.'
        : 'Restore needs a Play/App Store build. In development, use Simulate Remove Ads.',
    );
    return 'skipped';
  }
  try {
    await initConnection();
    await restorePurchases();
    const purchases = await getAvailablePurchases();
    const owned = (purchases ?? []).some((purchase) => purchaseOwnsRemoveAds(purchase));
    if (owned) {
      for (const purchase of purchases ?? []) {
        if (purchaseOwnsRemoveAds(purchase)) {
          await finishTransaction({ purchase, isConsumable: false });
        }
      }
      return 'owned';
    }
    return 'none';
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Restore failed';
    Alert.alert('Restore', message);
    return 'error';
  }
}

export function listenForRemoveAdsPurchase(onOwned: () => void): () => void {
  if (!isIapAvailable()) {
    return () => {};
  }
  const sub = purchaseUpdatedListener(async (purchase) => {
    if (purchaseOwnsRemoveAds(purchase)) {
      try {
        await finishTransaction({ purchase, isConsumable: false });
      } catch {
        // Still grant locally; Play may retry finish on next launch.
      }
      onOwned();
    }
  });
  return () => sub.remove();
}
