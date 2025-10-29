'use client';

import { NotFoundLottieAnimation } from './not-found-lottie-animation';

export function NotFoundPage() {
  return (
    <div className="absolute inset-0 z-[-10] flex flex-col items-center justify-center gap-4">
      <NotFoundLottieAnimation className="h-96 w-full max-w-96" />
      <p className="text-center text-xl font-bold">게시물을 불러오는데 실패했습니다.</p>
    </div>
  );
}
