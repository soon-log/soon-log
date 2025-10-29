import { Suspense } from 'react';

import { LoadingPage } from '@/shared/components/loading-page';

import { WebtoonCoverFlow } from '../_components/webtoon-cover-flow';
import { WebtoonFilterGroup } from '../_components/webtoon-filter-group';
import { WheelProvider } from '../_components/wheel/wheel-provider';

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
