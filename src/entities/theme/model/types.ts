import { THEME_TYPE } from './constants';

export type ThemeType = (typeof THEME_TYPE)[keyof typeof THEME_TYPE];
export type ResolvedTheme = typeof THEME_TYPE.LIGHT | typeof THEME_TYPE.DARK;
