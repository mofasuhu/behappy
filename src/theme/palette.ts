export type Palette = {
  background: string;
  card: string;
  text: string;
  muted: string;
  accent: string;
  accentSoft: string;
  border: string;
  success: string;
  danger: string;
  tabBar: string;
};

export const lightPalette: Palette = {
  background: '#FBF6EA',
  card: '#FFFDF7',
  text: '#3D2B1F',
  muted: '#8A7462',
  accent: '#C9920E',
  accentSoft: '#F3E2B3',
  border: '#E8D9C0',
  success: '#5C8A5C',
  danger: '#B85C4A',
  tabBar: '#FFF9EE',
};

export const darkPalette: Palette = {
  background: '#1C1612',
  card: '#2A221C',
  text: '#F7EEDC',
  muted: '#B5A08C',
  accent: '#E0B03A',
  accentSoft: '#4A3B1F',
  border: '#3F342A',
  success: '#8FBF8F',
  danger: '#E08A7A',
  tabBar: '#241C16',
};
