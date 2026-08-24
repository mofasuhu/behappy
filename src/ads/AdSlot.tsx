import { ReactNode } from 'react';

type Props = {
  showAds: boolean;
  children: ReactNode;
};

/** Pure gate used by tests and screens. Never wraps the mood/task check-in. */
export function AdSlot({ showAds, children }: Props) {
  if (!showAds) {
    return null;
  }
  return children;
}
