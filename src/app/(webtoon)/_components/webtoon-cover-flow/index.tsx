'use client';

import { useMemo, useState, useEffect } from 'react';

import { Webtoon } from '../../_types/webtoon';
import { WebtoonCard } from '../webtoon-card';
import { useWheel } from '../wheel/wheel-provider';

export function WebtoonCoverFlow() {
  const { cardIndex, rotationOffset, isDragging, isShuffling, webtoons } = useWheel();
  const [visibleCount, setVisibleCount] = useState(5);

  const halfVisible = Math.floor(visibleCount / 2);

  // 드래그 중에는 rotationOffset, 아니면 cardIndex 기준으로 카드 계산
  const baseIndex = isDragging ? Math.floor(rotationOffset) : cardIndex;
  const offset = isDragging ? rotationOffset - Math.floor(rotationOffset) : 0;

  // 표시할 카드들 계산
  const visibleCards = useMemo(() => {
    const cards: Array<{
      webtoon: Webtoon;
      position: number;
      key: string;
    }> = [];

    // 더 많은 카드를 렌더링하여 회전 시 자연스럽게 보이도록
    const renderRange = halfVisible + 2;

    for (let i = -renderRange; i <= renderRange; i++) {
      const index = (baseIndex + i + webtoons.length * 100) % webtoons.length;
      const webtoon = webtoons[index];
      if (!webtoon) continue;

      cards.push({
        webtoon,
        position: i - offset, // offset을 빼서 부드러운 회전 구현
        key: `${webtoon.id}-${index}-${i}`
      });
    }

    return cards;
  }, [baseIndex, offset, webtoons, halfVisible]);

  // 3D 변환 계산
  const getCardStyle = (position: number) => {
    const distance = Math.abs(position);

    // 중앙(position=0)일수록 scale 1, 멀어질수록 작아짐
    const scale = Math.max(0.5, 1 - distance * 0.15);

    // X축 위치: position에 따라 좌우로 배치
    const translateX = position * 280; // 카드 너비 + 간격

    // Z축: 중앙에서 멀어질수록 뒤로
    const translateZ = -distance * 100;

    // Y축 회전: 양옆 카드는 안쪽으로 회전
    const rotateY = position * -15;

    // 가시성: 범위를 벗어난 카드는 숨김
    const isVisible = distance <= halfVisible + 1;

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      transition: isDragging ? 'none' : 'transform 0.3s ease-out',
      zIndex: Math.round(100 - distance * 10),
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? ('auto' as const) : ('none' as const)
    };
  };

  // 화면 크기에 따라 표시할 카드 개수 결정
  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(window.innerWidth < 768 ? 3 : 5);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative h-[300px] w-full perspective-distant">
      <div className="absolute top-0 left-1/2 h-full w-full -translate-x-1/2 transform-3d">
        {visibleCards.map(({ webtoon, position, key }) => (
          <div
            key={key}
            className="absolute top-0 left-1/2 -translate-x-1/2"
            style={getCardStyle(position)}
          >
            <WebtoonCard
              webtoon={webtoon}
              isActive={position === 0 && !isDragging}
              isShuffling={isShuffling}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
