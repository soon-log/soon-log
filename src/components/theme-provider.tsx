'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    // 초기 렌더링 시 실제 테마 상태 확인
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'light';
  });
  const [mounted, setMounted] = useState(false);

  // 초기 테마 로드
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme;
    if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
      setTheme(storedTheme);
    }

    // 초기 로드 후 transition 활성화
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('no-transition');
    }, 100);

    setMounted(true);

    return () => clearTimeout(timer);
  }, []);

  // 테마 변경 시 적용
  useEffect(() => {
    if (!mounted) return;

    const applyTheme = () => {
      let currentTheme: 'light' | 'dark';

      if (theme === 'system') {
        currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        currentTheme = theme;
      }

      setResolvedTheme(currentTheme);

      // data-theme 속성과 class 모두 설정
      document.documentElement.setAttribute('data-theme', currentTheme);
      document.documentElement.classList.toggle('dark', currentTheme === 'dark');

      // localStorage에 저장
      localStorage.setItem('theme', theme);
    };

    applyTheme();

    // 시스템 테마 변경 감지
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
