import { WheelProvider } from '@/app/(webtoon)/_components/wheel/wheel-provider';

import { WebtoonCoverFlow } from '../_components/webtoon-cover-flow';

export default function WebtoonPage() {
  return (
    <div className="relative h-full overflow-hidden">
      <WheelProvider>
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2">
          <WebtoonCoverFlow />
        </div>
      </WheelProvider>
    </div>
  );
}
