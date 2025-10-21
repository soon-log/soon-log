'use client';

import Image from 'next/image';
import { MouseEvent, TouchEvent, useMemo } from 'react';

import { cn } from '@/lib/utils';

type WheelButtonProps = {
  onMouseDown: (e: MouseEvent<HTMLButtonElement>) => void;
  onTouchStart: (e: TouchEvent<HTMLButtonElement>) => void;
  xDistance: number;
  isDragging: boolean;
};

export function WheelButton({
  onMouseDown,
  onTouchStart,
  xDistance,
  isDragging
}: WheelButtonProps) {
  const style = useMemo(
    () => ({
      transform: `rotate(${xDistance}deg)`,
      transition: isDragging ? 'none' : 'transform 0.2s ease-out' // 드래그 중에는 전환 효과를 끔
    }),
    [xDistance, isDragging]
  );

  return (
    <button
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onContextMenu={(e) => e.preventDefault()}
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
        className="no-touch-callout object-contain"
        draggable={false}
        priority
      />
    </button>
  );
}
