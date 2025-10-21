import { Suspense } from 'react';

import { WheelProvider } from '@/app/(webtoon)/_components/wheel/wheel-provider';
import { LoadingPage } from '@/components/loading-page';

import { WebtoonCoverFlow } from '../_components/webtoon-cover-flow';

export default function WebtoonPage() {
  return (
    <div className="relative h-full overflow-hidden">
      <Suspense fallback={<LoadingPage />}>
        <WheelProvider>
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2">
            <WebtoonCoverFlow />
          </div>
        </WheelProvider>
      </Suspense>
    </div>
  );
}
