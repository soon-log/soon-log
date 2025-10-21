'use client';

import Skeleton from 'react-loading-skeleton';

import { cn } from '@/lib/utils';

import { Webtoon } from '../../_types/webtoon';

import { BackSide } from './back-side';
import { FrontSide } from './front-side';

import 'react-loading-skeleton/dist/skeleton.css';

type WebtoonCardProps = {
  isActive?: boolean;
  webtoon: Webtoon;
  className?: string;
  isShuffling?: boolean;
};

export function WebtoonCard({ className, webtoon, isActive, isShuffling }: WebtoonCardProps) {
  // 셔플 중이면 스켈레톤 표시
  if (isShuffling) {
    return <Skeleton width={240} height={300} borderRadius={5} />;
  }

  return (
    <div
      className={cn(
        'group h-[300px] w-[240px]',
        // 드래그 중에는 hover 비활성화
        isActive && 'hover:cursor-pointer',
        className
      )}
    >
      <div
        className={cn(
          'h-full w-full transform-3d',
          // 중앙 카드만 hover 시 플립 가능
          isActive && 'webtoon-active-card'
        )}
      >
        <FrontSide title={webtoon.title} thumbnail={webtoon.thumbnail} isActive={isActive} />
        <BackSide webtoon={webtoon} />
      </div>
    </div>
  );
}
