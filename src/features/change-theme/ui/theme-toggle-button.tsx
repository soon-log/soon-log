'use client';

import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

import { THEME_TYPE, useTheme, ResolvedTheme } from '@/entities/theme';
import { Button } from '@/shared/ui/button';

export function ThemeToggleButton() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() =>
        setTheme(resolvedTheme === THEME_TYPE.LIGHT ? THEME_TYPE.DARK : THEME_TYPE.LIGHT)
      }
      aria-label="테마 전환"
      className="relative"
      data-testid="theme-toggle-button"
    >
      {mounted ? getThemeIcon(resolvedTheme) : getInitialIcon()}
    </Button>
  );
}

/**
 * 테마 아이콘 반환
 * @param resolvedTheme - 현재 테마 타입
 * @returns 아이콘
 */
const getThemeIcon = (theme: ResolvedTheme) => {
  return theme === THEME_TYPE.LIGHT ? (
    <Moon className="h-4 w-4" data-testid="moon-icon" />
  ) : (
    <Sun className="h-4 w-4" data-testid="sun-icon" />
  );
};

/**
 * 마운트 전에는 시스템 테마 기준으로 아이콘 표시
 * @returns 아이콘
 */
const getInitialIcon = () => {
  return (
    <>
      <Moon className="block h-4 w-4 dark:hidden" data-testid="moon-icon" />
      <Sun className="hidden h-4 w-4 dark:block" data-testid="sun-icon" />
    </>
  );
};
