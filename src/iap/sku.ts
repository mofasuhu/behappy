export const REMOVE_ADS_SKU = 'remove_ads';

export function purchaseOwnsRemoveAds(purchase: { productId?: string | null; ids?: (string | null)[] | null }): boolean {
  if (purchase.productId === REMOVE_ADS_SKU) {
    return true;
  }
  return Boolean(purchase.ids?.includes(REMOVE_ADS_SKU));
}
