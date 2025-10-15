import { WheelProvider } from '@/app/(webtoon)/_components/wheel/wheel-provider';
import { fetchWebtoons } from '@/app/(webtoon)/_service/webtoons';

import { WebtoonCoverFlow } from '../_components/webtoon-cover-flow';

export default async function WebtoonPage() {
  const { webtoons } = await fetchWebtoons();
  return (
    <div className="relative h-full overflow-hidden">
      <WheelProvider webtoonsLength={webtoons.length}>
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2">
          <WebtoonCoverFlow webtoons={webtoons} />
        </div>
      </WheelProvider>
    </div>
  );
}
