import { isIapAvailable } from '@/src/ads/availability';

export function loadExpoIap(): typeof import('expo-iap') | null {
  if (!isIapAvailable()) {
    return null;
  }
  try {
    return require('expo-iap') as typeof import('expo-iap');
  } catch {
    return null;
  }
}
