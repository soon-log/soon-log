'use client';

import Lottie from 'lottie-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import animationData from './404 error animation.json';

interface NotFoundLottieAnimationProps {
  className?: string;
}

export function NotFoundLottieAnimation({ className }: NotFoundLottieAnimationProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={cn(
          'text-muted-foreground flex h-64 w-64 items-center justify-center',
          className
        )}
        role="img"
        aria-label="404 오류 애니메이션"
      >
        <div className="text-center">
          <div className="text-6xl font-bold">404</div>
          <div className="mt-2 text-sm">애니메이션을 불러올 수 없습니다</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn('h-64 w-64', className)}
      role="img"
      aria-label="404 페이지를 찾을 수 없음 애니메이션"
    >
      <Lottie
        animationData={animationData}
        loop
        autoplay
        style={{ height: '100%', width: '100%' }}
        onError={() => setHasError(true)}
        aria-hidden="true"
      />
    </div>
  );
}
