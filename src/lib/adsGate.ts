/** Ads show only when the user has not removed them (purchase or dev simulate). */
export function shouldShowAds(adsRemoved: boolean, simulatePurchased = false): boolean {
  return !(adsRemoved || simulatePurchased);
}
