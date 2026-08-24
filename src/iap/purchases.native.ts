import { Alert, Platform } from 'react-native';

import { isIapAvailable } from '@/src/ads/availability';
import { loadExpoIap } from './loadNativeIap';
import { REMOVE_ADS_SKU, purchaseOwnsRemoveAds } from './sku';

export { REMOVE_ADS_SKU, purchaseOwnsRemoveAds };

export async function buyRemoveAds(): Promise<'ok' | 'unavailable' | 'error'> {
  const iap = isIapAvailable() ? loadExpoIap() : null;
  if (!iap) {
    Alert.alert(
      'Store not available',
      'Google Play Billing needs a development or production build. In Expo Go, use Simulate Remove Ads in Settings.',
    );
    return 'unavailable';
  }
  try {
    await iap.initConnection();
    await iap.fetchProducts({ skus: [REMOVE_ADS_SKU], type: 'in-app' });
    await iap.requestPurchase({
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
  const iap = isIapAvailable() ? loadExpoIap() : null;
  if (!iap) {
    Alert.alert(
      'Restore',
      Platform.OS === 'web'
        ? 'Purchases are not available on web.'
        : 'Restore needs a Play/App Store build. In development, use Simulate Remove Ads.',
    );
    return 'skipped';
  }
  try {
    await iap.initConnection();
    await iap.restorePurchases();
    const purchases = await iap.getAvailablePurchases();
    const owned = (purchases ?? []).some((purchase) => purchaseOwnsRemoveAds(purchase));
    if (owned) {
      for (const purchase of purchases ?? []) {
        if (purchaseOwnsRemoveAds(purchase)) {
          await iap.finishTransaction({ purchase, isConsumable: false });
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
  const iap = isIapAvailable() ? loadExpoIap() : null;
  if (!iap) {
    return () => {};
  }
  const sub = iap.purchaseUpdatedListener(async (purchase) => {
    if (purchaseOwnsRemoveAds(purchase)) {
      try {
        await iap.finishTransaction({ purchase, isConsumable: false });
      } catch {
        // Still grant locally; Play may retry finish on next launch.
      }
      onOwned();
    }
  });
  return () => sub.remove();
}
