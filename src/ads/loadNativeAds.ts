import { isAdsSdkAvailable } from './availability';

export function loadGoogleMobileAds(): typeof import('react-native-google-mobile-ads') | null {
  if (!isAdsSdkAvailable()) {
    return null;
  }
  try {
    // Expo Go has no AdMob native module; a static import crashes at load time.
    return require('react-native-google-mobile-ads') as typeof import('react-native-google-mobile-ads');
  } catch {
    return null;
  }
}
