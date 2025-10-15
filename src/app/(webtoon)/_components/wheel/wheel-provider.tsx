'use client';

import { createContext, MouseEvent, useContext, useEffect, useRef, useState } from 'react';

import { WheelButton } from '@/app/(webtoon)/_components/wheel/wheel-button';

type WheelContextType = {
  cardIndex: number;
  xDistance: number;
  isDragging: boolean;
};

const WheelContext = createContext<WheelContextType | null>(null);

const useWheelDrag = ({ webtoonsLength }: { webtoonsLength: number }) => {
  // 현재 카드 인덱스
  const [cardIndex, setCardIndex] = useState(0);
  // x 이동 길이, -면 왼쪽, +면 오른쪽
  const [xDistance, setXDistance] = useState(0);

  const isDraggingRef = useRef(false); // 현재 드래그 중인지 여부
  const startXRef = useRef(0); // 드래그 시작 시점의 마우스 X 좌표
  const startXDistanceRef = useRef(0); // 드래그 시작 시점의 X 거리
  const currentXDistanceRef = useRef(0); // 현재 X 거리

  const handleMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startXDistanceRef.current = xDistance;
    currentXDistanceRef.current = xDistance;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // 마우스를 움직일 때 호출되는 핸들러
  const handleMouseMove = (e: globalThis.MouseEvent) => {
    if (!isDraggingRef.current) return;

    const currentX = e.clientX;
    // 드래그 해서 움직인 X 좌표 거리
    const draggedX = currentX - startXRef.current;

    // 드래그 민감도. 숫자가 클수록 조금만 움직여도 많이 움직인다.
    const sensitivity = 0.2;
    const xDistanceChange = draggedX * sensitivity;

    const newXDistance = Math.round(startXDistanceRef.current + xDistanceChange);
    currentXDistanceRef.current = newXDistance;

    setXDistance(newXDistance);
  };

  // 마우스 버튼을 뗐을 때 호출되는 핸들러
  const handleMouseUp = () => {
    isDraggingRef.current = false;
    const currentXDistance = currentXDistanceRef.current;

    const tempCardIndex = Math.round(currentXDistance / 45);
    const cardIndex =
      tempCardIndex < 0
        ? webtoonsLength + (tempCardIndex % webtoonsLength)
        : tempCardIndex === 0
          ? 0
          : tempCardIndex % webtoonsLength;

    setCardIndex(cardIndex);

    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    handleMouseDown,
    xDistance,
    cardIndex,
    isDraggingRef
  };
};

type WheelProviderProps = {
  children: React.ReactNode;
  webtoonsLength: number;
};

export function WheelProvider({ children, webtoonsLength }: WheelProviderProps) {
  const { handleMouseDown, xDistance, cardIndex, isDraggingRef } = useWheelDrag({ webtoonsLength });

  return (
    <WheelContext.Provider value={{ cardIndex, xDistance, isDragging: isDraggingRef.current }}>
      {children}
      <WheelButton
        onMouseDown={handleMouseDown}
        xDistance={xDistance}
        isDraggingRef={isDraggingRef}
      />
    </WheelContext.Provider>
  );
}

export const useWheelContext = () => {
  const context = useContext<WheelContextType | null>(WheelContext);
  if (!context) {
    throw new Error('useWheelContext must be used within a WheelProvider');
  }
  return context;
};
