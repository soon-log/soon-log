'use client';

import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (resolvedTheme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    return resolvedTheme === 'light' ? (
      <Moon className="h-4 w-4" data-testid="moon-icon" />
    ) : (
      <Sun className="h-4 w-4" data-testid="sun-icon" />
    );
  };

  // 마운트 전에는 시스템 테마 기준으로 아이콘 표시
  const getInitialIcon = () => {
    return (
      <>
        <Moon className="block h-4 w-4 dark:hidden" data-testid="moon-icon" />
        <Sun className="hidden h-4 w-4 dark:block" data-testid="sun-icon" />
      </>
    );
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="테마 전환"
      className="relative"
    >
      {mounted ? getThemeIcon() : getInitialIcon()}
    </Button>
  );
}
