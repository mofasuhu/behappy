import { isAdsSdkAvailable } from './availability';
import { loadGoogleMobileAds } from './loadNativeAds';

export async function requestAdsConsent(debugEea = false): Promise<{ status: string; canRequestAds: boolean }> {
  if (!isAdsSdkAvailable()) {
    return { status: 'unavailable', canRequestAds: false };
  }
  const ads = loadGoogleMobileAds();
  if (!ads) {
    return { status: 'unavailable', canRequestAds: false };
  }
  const options = debugEea ? { debugGeography: ads.AdsConsentDebugGeography.EEA } : undefined;
  const info = await ads.AdsConsent.gatherConsent(options);
  await ads.MobileAds().initialize();
  return {
    status: String(info.status),
    canRequestAds: Boolean(info.canRequestAds ?? true),
  };
}

export async function showConsentFormForDebug(): Promise<string> {
  if (!isAdsSdkAvailable()) {
    return 'unavailable';
  }
  const ads = loadGoogleMobileAds();
  if (!ads) {
    return 'unavailable';
  }
  const info = await ads.AdsConsent.showForm();
  return String(info.status);
}
