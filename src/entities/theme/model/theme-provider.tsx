'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useLayoutEffect
} from 'react';

import { THEME_TYPE, THEME_TYPES } from './constants';
import type { ThemeType, ResolvedTheme } from './types';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  resolvedTheme: ResolvedTheme;
}

const THEME_STORAGE_KEY = 'theme' as const;
const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
ThemeContext.displayName = 'ThemeContext';

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme는 ThemeProvider 내에서만 사용할 수 있습니다.');
  }
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>(() => {
    try {
      const raw = localStorage.getItem(THEME_STORAGE_KEY);
      if (!raw) return THEME_TYPE.SYSTEM;
      return (THEME_TYPES as string[]).includes(raw) ? (raw as ThemeType) : THEME_TYPE.SYSTEM;
    } catch {
      return THEME_TYPE.SYSTEM;
    }
  });

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return THEME_TYPE.LIGHT;
    return window.matchMedia(DARK_MEDIA_QUERY).matches ? THEME_TYPE.DARK : THEME_TYPE.LIGHT;
  });

  const resolvedTheme: ResolvedTheme =
    theme === THEME_TYPE.SYSTEM ? systemTheme : (theme as ResolvedTheme);

  const applyHtmlTheme = useCallback((t: ResolvedTheme) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', t);
    root.classList.toggle('dark', t === THEME_TYPE.DARK);
  }, []);

  const handleSetTheme = useCallback((next: ThemeType) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      console.error('[오류] 테마 저장 오류:', next);
    }
    setTheme(next);
  }, []);

  useLayoutEffect(() => {
    applyHtmlTheme(resolvedTheme);
  }, [resolvedTheme, applyHtmlTheme]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia(DARK_MEDIA_QUERY);
    const onChange = () => setSystemTheme(mql.matches ? THEME_TYPE.DARK : THEME_TYPE.LIGHT);

    if (mql.addEventListener) {
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    } else {
      mql.addListener(onChange);
      return () => mql.removeListener(onChange);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('no-transition')) return;
    const id = window.setTimeout(() => root.classList.remove('no-transition'), 100);
    return () => window.clearTimeout(id);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme: handleSetTheme,
      resolvedTheme
    }),
    [theme, handleSetTheme, resolvedTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
