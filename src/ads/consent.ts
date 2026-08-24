export async function requestAdsConsent(_debugEea = false): Promise<{ status: string; canRequestAds: boolean }> {
  return { status: 'unavailable', canRequestAds: false };
}

export async function showConsentFormForDebug(): Promise<string> {
  return 'unavailable';
}
