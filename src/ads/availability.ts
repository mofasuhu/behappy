import { NativeModules } from 'react-native';

export function isAdsSdkAvailable(): boolean {
  const modules = NativeModules ?? {};
  return Object.keys(modules).some((name) => /GoogleMobileAds|RNGoogleMobileAds/i.test(name));
}

export function isIapAvailable(): boolean {
  const modules = NativeModules ?? {};
  return Boolean(modules.ExpoIap) || Object.keys(modules).some((name) => /^ExpoIap/i.test(name));
}
