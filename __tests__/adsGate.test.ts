import { shouldShowAds } from '@/src/lib/adsGate';

describe('shouldShowAds', () => {
  it('shows ads by default', () => {
    expect(shouldShowAds(false, false)).toBe(true);
  });

  it('hides ads after purchase', () => {
    expect(shouldShowAds(true, false)).toBe(false);
  });

  it('hides ads when simulate purchased is on', () => {
    expect(shouldShowAds(false, true)).toBe(false);
  });
});
