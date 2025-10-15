'use client';

import { CSSProperties, useMemo } from 'react';

import { Webtoon } from '@/app/(webtoon)/_types/webtoon';

import { WebtoonCard } from '../webtoon-card';
import { useWheelContext } from '../wheel/wheel-provider';

type CardStyle = {
  transform: string;
  opacity: number;
  zIndex: number;
  transition: string;
};

// 상대 위치에 따른 스타일 계산
const getCardStyle = (
  relativePosition: number,
  xDistance: number,
  isDragging: boolean
): CardStyle => {
  // 45도 = 1칸 이동, xDistance를 45로 나눈 값이 추가 이동량
  const offset = (xDistance % 45) / 45;
  const actualPosition = relativePosition - offset;

  // 중앙(0)을 기준으로 좌우 대칭 배치
  const baseSpacing = 210; // 카드 간 기본 간격
  const translateX = actualPosition * baseSpacing;

  // 중앙에 가까울수록 크고, 멀수록 작게
  const scale = Math.max(0.6, 1 - Math.abs(actualPosition) * 0.15);

  // Z축: 중앙이 가장 앞으로
  const translateZ = -Math.abs(actualPosition) * 150;

  // Y축: 양쪽으로 갈수록 아래로
  const translateY = Math.abs(actualPosition) * -20;

  // 회전: 양쪽으로 갈수록 살짝 회전
  const rotateY = actualPosition * -15;

  // 투명도: 양쪽 끝은 희미하게
  const opacity = Math.max(0, 1 - Math.abs(actualPosition) * 0.3);

  console.log({
    relativePosition,
    xDistance,
    offset,
    actualPosition,
    translateX,
    translateY,
    translateZ
  });

  return {
    transform: `
      translateX(${translateX}px) 
      translateY(${translateY}px) 
      translateZ(${translateZ}px) 
      rotateY(${rotateY}deg) 
      scale(${scale})
    `,
    opacity,
    zIndex: Math.round(100 - Math.abs(actualPosition) * 10),
    // 드래그 중이 아닐 때만 transition 적용
    transition: isDragging
      ? 'none'
      : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out'
  };
};

// 항상 고정된 7개의 카드 (좌 3개, 중앙 1개, 우 3개)
const POSITIONS = [-3, -2, -1, 0, 1, 2, 3] as const;

const useCoverFlow = ({ webtoons }: { webtoons: Webtoon[] }) => {
  const { cardIndex, xDistance, isDragging } = useWheelContext();
  const centerWebtoon = webtoons[cardIndex];

  const activeItems = useMemo(() => {
    // xDistance를 45로 나눈 몫이 실제 이동한 칸 수
    const movedSteps = Math.floor(xDistance / 45);
    const baseIndex = cardIndex;

    return POSITIONS.map((relativePosition) => {
      // 순환 인덱스 계산
      let dataIndex = (baseIndex + relativePosition + movedSteps) % webtoons.length;
      if (dataIndex < 0) dataIndex += webtoons.length;

      const webtoon = webtoons[dataIndex];
      if (!webtoon) {
        throw new Error(`Webtoon at index ${dataIndex} not found`);
      }

      return {
        webtoon,
        relativePosition,
        // key는 고정된 위치 기반 (DOM 재사용)
        key: `card-${relativePosition}`,
        style: getCardStyle(relativePosition, xDistance, isDragging)
      };
    });
  }, [webtoons, cardIndex, xDistance, isDragging]);

  return { activeItems, isDragging, centerWebtoon };
};

export function WebtoonCoverFlow({ webtoons }: { webtoons: Array<Webtoon> }) {
  const { activeItems, isDragging, centerWebtoon } = useCoverFlow({ webtoons });

  if (!activeItems?.length) {
    return null;
  }

  return (
    <div className="relative flex h-[500px] w-full items-center justify-center perspective-distant">
      <ul className="relative flex h-full w-full items-center justify-center transform-3d">
        {activeItems.map((item) => {
          const isActive = item.webtoon.id === centerWebtoon?.id;

          return (
            <li key={item.key} className="absolute" style={item.style as CSSProperties}>
              <WebtoonCard webtoon={item.webtoon} isActive={!isDragging && isActive} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
