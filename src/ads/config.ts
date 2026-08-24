export const GOOGLE_TEST_ANDROID_APP_ID = 'ca-app-pub-3940256099942544~3347511713';
export const GOOGLE_TEST_IOS_APP_ID = 'ca-app-pub-3940256099942544~1458002511';

/** Always use Google's sample banner unit in __DEV__. */
export function bannerUnitId(productionUnitId?: string): string {
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return 'ca-app-pub-3940256099942544/6300978111';
  }
  return productionUnitId || 'ca-app-pub-3940256099942544/6300978111';
}

export const PRODUCTION_BANNER_UNIT_ID = process.env.EXPO_PUBLIC_ADMOB_BANNER_UNIT_ID;
