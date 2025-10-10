'use client';

import { cn } from '@/lib/utils';

import { Webtoon } from '../../_types/webtoon';

import { BackSide } from './back-side';
import { FrontSide } from './front-side';

type WebtoonCardProps = {
  isActive?: boolean;
  webtoon: Webtoon;
  className?: string;
};

export function WebtoonCard({ className, webtoon, isActive }: WebtoonCardProps) {
  return (
    <div className={cn('group h-[300px] w-[240px] overflow-visible', className)}>
      <div className={cn('preserve-3d h-full w-full', isActive && 'webtoon-flip-card')}>
        <FrontSide title={webtoon.title} thumbnail={webtoon.thumbnail} isActive={isActive} />
        <BackSide webtoon={webtoon} />
      </div>
    </div>
  );
}
