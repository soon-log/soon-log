'use client';

import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import { useIsMobile } from '@/hooks/use-is-mobile';
import { cn } from '@/lib/utils';

import { Webtoon } from '../../_types/webtoon';
import { useWheel } from '../wheel/wheel-provider';

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
  const isMobile = useIsMobile();
  const { isDragging } = useWheel();
  const [rotationY, setRotationY] = useState(0);

  // 톱니바퀴 드래그 시 카드 앞면으로 초기화
  useEffect(() => {
    if (isDragging && rotationY !== 0) {
      setRotationY(0);
    }
  }, [isDragging, rotationY]);

  // 셔플 중이면 스켈레톤 표시
  if (isShuffling) {
    return <Skeleton width={240} height={300} borderRadius={5} />;
  }

  // 모바일에서 중앙 카드 클릭 시 180도씩 회전
  const handleCardClick = () => {
    if (isMobile && isActive) {
      setRotationY((prev) => prev + 180);
    }
  };

  return (
    <div
      className={cn('group h-[300px] w-[240px]', isActive && 'hover:cursor-pointer', className)}
      onClick={handleCardClick}
    >
      <div
        className={cn(
          'h-full w-full transform-3d',
          // 데스크톱/태블릿: hover로 플립
          isActive && !isMobile && 'webtoon-active-card'
        )}
        style={
          isActive && isMobile
            ? {
                transform: `rotateY(${rotationY}deg)`,
                transition: 'transform 0.3s ease'
              }
            : undefined
        }
      >
        <FrontSide title={webtoon.title} thumbnail={webtoon.thumbnail} isActive={isActive} />
        <BackSide webtoon={webtoon} />
      </div>
    </div>
  );
}
