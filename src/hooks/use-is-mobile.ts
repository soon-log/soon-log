'use client';

import { useEffect, useState } from 'react';

/**
 * 모바일 화면 판단 커스텀 훅
 * max-width: 768px 기준으로 모바일 여부를 판단
 * @returns {boolean} isMobile - 모바일 화면 여부
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(max-width: 768px)');

    setIsMobile(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isMobile;
}
