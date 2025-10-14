'use client';

import { createContext, MouseEvent, useContext, useEffect, useRef, useState } from 'react';

import { WheelButton } from '@/app/(webtoon)/_components/wheel/wheel-button';

type WheelContextType = {
  cardIndex: number;
  rotation: number;
  isDragging: boolean;
};

const WheelContext = createContext<WheelContextType | null>(null);

const useWheelDrag = () => {
  // 현재 카드 인덱스
  const [cardIndex, setCardIndex] = useState(0);
  // 휠의 회전 각도, -면 왼쪽, +면 오른쪽
  const [rotation, setRotation] = useState(0);

  const isDraggingRef = useRef(false); // 현재 드래그 중인지 여부
  const startXRef = useRef<number>(0); // 드래그 시작 시점의 마우스 X 좌표
  const startRotationRef = useRef(0); // 드래그 시작 시점의 휠 각도
  const currentRotationRef = useRef(0); // 현재 휠 각도

  const handleMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startRotationRef.current = rotation;
    currentRotationRef.current = rotation;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // 마우스를 움직일 때 호출되는 핸들러
  const handleMouseMove = (e: globalThis.MouseEvent) => {
    if (!isDraggingRef.current) return;

    const currentX = e.clientX;
    // 드래그 해서 움직인 X 좌표 거리
    const draggedX = currentX - startXRef.current;

    // 드래그 민감도. 숫자가 클수록 조금만 움직여도 많이 회전한다.
    const sensitivity = 0.2;
    const rotationChange = draggedX * sensitivity;

    const newRotation = Math.floor(startRotationRef.current + rotationChange);
    currentRotationRef.current = newRotation;

    const currentIndex = Math.round(newRotation / 45);
    setCardIndex(currentIndex);

    setRotation(newRotation);
  };

  // 마우스 버튼을 뗐을 때 호출되는 핸들러
  const handleMouseUp = () => {
    isDraggingRef.current = false;
    const latestRotation = currentRotationRef.current;

    // 최종 각도를 45도에 가깝게 스냅한다.
    const snappedRotation = Math.round(latestRotation / 45) * 45;
    currentRotationRef.current = snappedRotation;

    setRotation(snappedRotation);

    // 현재 페이지 인덱스
    const index = snappedRotation / 45;
    setCardIndex(index);

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
    rotation,
    cardIndex,
    isDraggingRef
  };
};

export function WheelProvider({ children }: { children: React.ReactNode }) {
  const { handleMouseDown, rotation, cardIndex, isDraggingRef } = useWheelDrag();

  return (
    <WheelContext.Provider value={{ cardIndex, rotation, isDragging: isDraggingRef.current }}>
      {children}
      <WheelButton
        onMouseDown={handleMouseDown}
        rotation={rotation}
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
