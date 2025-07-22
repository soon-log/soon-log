'use client';

import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

import { useTheme } from '@/components/theme/theme-provider';
import { Button } from '@/components/ui/button';
import { Theme } from '@/constants/theme';
import { ResolvedTheme } from '@/types/theme';

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

/**
 * 테마 아이콘 반환
 * @param resolvedTheme - 현재 테마 타입
 * @returns 아이콘
 */
const getThemeIcon = (theme: ResolvedTheme) => {
  return theme === Theme.LIGHT ? (
    <Moon className="h-4 w-4" data-testid="moon-icon" />
  ) : (
    <Sun className="h-4 w-4" data-testid="sun-icon" />
  );
};

export function ThemeToggleButton() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const toggleTheme = () => {
    setTheme(resolvedTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="테마 전환"
      className="relative"
      data-testid="theme-toggle-button"
    >
      {mounted ? getThemeIcon(resolvedTheme) : getInitialIcon()}
    </Button>
  );
}
