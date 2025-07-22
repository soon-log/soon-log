import { Theme } from '@/constants/theme';

export type ThemeType = (typeof Theme)[keyof typeof Theme];
export type ResolvedTheme = typeof Theme.LIGHT | typeof Theme.DARK;
