'use client';

import Image from 'next/image';
import { useState, useRef, MouseEvent, useEffect, useMemo } from 'react';

import { useRotationVelocity } from '@/app/(webtoon)/_hooks/use-rotation-velocity';
import { cn } from '@/lib/utils';

const useWheelDrag = () => {
  const [rotation, setRotation] = useState(0);
  const { startTracking, calculateVelocity } = useRotationVelocity();

  const isDraggingRef = useRef(false); // 현재 드래그 중인지 여부
  const startXRef = useRef(0); // 드래그 시작 시점의 마우스 X 좌표
  const startAngleRef = useRef(0); // 드래그 시작 시점의 휠 각도
  const currentRotationRef = useRef(0); // 현재 휠 각도

  const handleMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startAngleRef.current = rotation;
    currentRotationRef.current = rotation;

    startTracking(rotation); // 속도 추적 시작

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // 마우스를 움직일 때 호출되는 핸들러
  const handleMouseMove = (e: globalThis.MouseEvent) => {
    if (!isDraggingRef.current) return;

    const currentX = e.clientX;
    const deltaX = currentX - startXRef.current;

    // 드래그 민감도. 숫자가 클수록 조금만 움직여도 많이 회전한다.
    const sensitivity = 0.2;
    const rotationChange = deltaX * sensitivity;

    const newRotation = startAngleRef.current + rotationChange;
    currentRotationRef.current = newRotation;

    setRotation(newRotation);
  };

  // 마우스 버튼을 뗐을 때 호출되는 핸들러
  const handleMouseUp = () => {
    isDraggingRef.current = false;
    const latestRotation = currentRotationRef.current;

    const { isFast } = calculateVelocity(latestRotation);

    // 최종 각도를 45도에 가깝게 스냅한다.
    // (현재 각도 / 45)를 반올림한 후 다시 45를 곱한다.
    const snappedRotation = Math.round(latestRotation / 45) * 45;
    currentRotationRef.current = snappedRotation;
    setRotation(snappedRotation);

    const page = snappedRotation / 45;
    console.log(
      `최종 각도: ${snappedRotation}도, ${page}페이지\n` +
        `${isFast ? '빠른 드래그' : '느린 드래그'}`
    );

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
    isDraggingRef,
    startXRef,
    startAngleRef
  };
};

export function Wheel() {
  const { handleMouseDown, rotation, isDraggingRef } = useWheelDrag();

  const style = useMemo(
    () => ({
      transform: `rotate(${rotation}deg)`,
      transition: isDraggingRef.current ? 'none' : 'transform 0.2s ease-out' // 드래그 중에는 전환 효과를 끔
    }),
    [rotation, isDraggingRef]
  );

  return (
    <button
      onMouseDown={handleMouseDown}
      className={cn(
        'absolute bottom-[-75vh] left-1/2 z-10 aspect-square h-screen -translate-x-1/2',
        'cursor-grab touch-none active:cursor-grabbing'
      )}
      style={style}
    >
      <Image
        src="/webtoon/wheel.png"
        fill
        alt="휠"
        sizes="100vh"
        className="object-contain"
        draggable={false}
        priority
      />
    </button>
  );
}
