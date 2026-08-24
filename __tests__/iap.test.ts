import { purchaseOwnsRemoveAds, REMOVE_ADS_SKU } from '@/src/iap/sku';

describe('purchaseOwnsRemoveAds', () => {
  it('matches the Remove Ads SKU on productId or ids', () => {
    expect(purchaseOwnsRemoveAds({ productId: REMOVE_ADS_SKU })).toBe(true);
    expect(purchaseOwnsRemoveAds({ productId: 'other', ids: [REMOVE_ADS_SKU] })).toBe(true);
    expect(purchaseOwnsRemoveAds({ productId: 'other', ids: [] })).toBe(false);
  });
});
