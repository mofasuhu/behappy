import React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';

import { AdSlot } from '@/src/ads/AdSlot';

describe('AdSlot', () => {
  it('renders children when ads should show', async () => {
    await render(
      <AdSlot showAds>
        <Text>banner</Text>
      </AdSlot>,
    );
    expect(screen.getByText('banner')).toBeTruthy();
  });

  it('hides children when ads are removed', async () => {
    await render(
      <AdSlot showAds={false}>
        <Text>banner</Text>
      </AdSlot>,
    );
    expect(screen.queryByText('banner')).toBeNull();
  });
});
