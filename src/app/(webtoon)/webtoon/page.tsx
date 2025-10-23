import { Suspense } from 'react';

import { WheelProvider } from '@/app/(webtoon)/_components/wheel/wheel-provider';
import { LoadingPage } from '@/components/loading-page';

import { WebtoonCoverFlow } from '../_components/webtoon-cover-flow';
import { WebtoonFilterGroup } from '../_components/webtoon-filter-group';

export default function WebtoonPage() {
  return (
    <div className="relative h-full overflow-hidden">
      <Suspense fallback={<LoadingPage />}>
        <WheelProvider>
          <div className="my-8">
            <WebtoonCoverFlow />
          </div>
        </WheelProvider>
        <WebtoonFilterGroup />
      </Suspense>
    </div>
  );
}
