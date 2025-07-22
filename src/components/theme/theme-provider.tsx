'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

import { Theme, Themes } from '@/constants/theme';
import { ThemeType, ResolvedTheme } from '@/types/theme';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  resolvedTheme: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme는 ThemeProvider 내에서만 사용할 수 있습니다.');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeType>(Theme.SYSTEM);
  const [mounted, setMounted] = useState(false);

  const resolvedTheme: ResolvedTheme = (() => {
    if (!mounted) {
      return Theme.LIGHT;
    }
    if (theme === Theme.SYSTEM) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT;
    }
    return theme;
  })();

  const handleSetTheme = useCallback((newTheme: ThemeType) => {
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as ThemeType;
    if (Themes.includes(storedTheme)) {
      setTheme(storedTheme);
    }

    setMounted(true);

    const timer = setTimeout(() => {
      document.documentElement.classList.remove('no-transition');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    document.documentElement.setAttribute('data-theme', resolvedTheme);
    document.documentElement.classList.toggle('dark', resolvedTheme === Theme.DARK);

    if (theme === Theme.SYSTEM) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => setTheme(mediaQuery.matches ? Theme.DARK : Theme.LIGHT);

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, resolvedTheme, mounted]);

  const value = {
    theme,
    setTheme: handleSetTheme,
    resolvedTheme
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
