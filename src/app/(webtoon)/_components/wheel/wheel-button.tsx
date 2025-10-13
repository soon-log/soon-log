'use client';

import Image from 'next/image';
import { MouseEvent, useMemo, RefObject } from 'react';

import { cn } from '@/lib/utils';

type WheelButtonProps = {
  onMouseDown: (e: MouseEvent<HTMLButtonElement>) => void;
  rotation: number;
  isDraggingRef: RefObject<boolean>;
};

export function WheelButton({ onMouseDown, rotation, isDraggingRef }: WheelButtonProps) {
  const style = useMemo(
    () => ({
      transform: `rotate(${rotation}deg)`,
      transition: isDraggingRef.current ? 'none' : 'transform 0.2s ease-out' // 드래그 중에는 전환 효과를 끔
    }),
    [rotation, isDraggingRef]
  );

  return (
    <button
      onMouseDown={onMouseDown}
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
