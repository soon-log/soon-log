'use client';

import Lottie from 'lottie-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import animationData from './loading-animation.json';

interface LoadingLottieAnimationProps {
  className?: string;
}

export function LoadingLottieAnimation({ className }: LoadingLottieAnimationProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={cn(
          'text-muted-foreground flex h-64 w-64 items-center justify-center',
          className
        )}
        role="img"
        aria-label="로딩 애니메이션"
      >
        <div className="text-center">
          <div className="text-6xl font-bold">Loading...</div>
          <div className="mt-2 text-sm">애니메이션을 불러오는 중입니다</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('h-64 w-64', className)} role="img" aria-label="로딩 애니메이션">
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
