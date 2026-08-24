import { AdsConsent, AdsConsentDebugGeography, MobileAds } from 'react-native-google-mobile-ads';

import { isAdsSdkAvailable } from './availability';

export async function requestAdsConsent(debugEea = false): Promise<{ status: string; canRequestAds: boolean }> {
  if (!isAdsSdkAvailable()) {
    return { status: 'unavailable', canRequestAds: false };
  }
  const options = debugEea ? { debugGeography: AdsConsentDebugGeography.EEA } : undefined;
  const info = await AdsConsent.gatherConsent(options);
  await MobileAds().initialize();
  return {
    status: String(info.status),
    canRequestAds: Boolean(info.canRequestAds ?? true),
  };
}

export async function showConsentFormForDebug(): Promise<string> {
  if (!isAdsSdkAvailable()) {
    return 'unavailable';
  }
  const info = await AdsConsent.showForm();
  return String(info.status);
}
