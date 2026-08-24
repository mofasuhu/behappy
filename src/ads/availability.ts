import Constants from 'expo-constants';
import { NativeModules } from 'react-native';

/** Expo Go cannot load AdMob / Play Billing native modules. */
export function isExpoGo(): boolean {
  return (
    Constants.appOwnership === 'expo' ||
    Constants.executionEnvironment === 'storeClient'
  );
}

export function isAdsSdkAvailable(): boolean {
  if (isExpoGo()) {
    return false;
  }
  const modules = NativeModules ?? {};
  return Object.keys(modules).some((name) => /GoogleMobileAds|RNGoogleMobileAds/i.test(name));
}

export function isIapAvailable(): boolean {
  if (isExpoGo()) {
    return false;
  }
  const modules = NativeModules ?? {};
  return Boolean(modules.ExpoIap) || Object.keys(modules).some((name) => /^ExpoIap/i.test(name));
}
