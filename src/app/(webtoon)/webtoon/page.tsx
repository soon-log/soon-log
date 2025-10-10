import { WebtoonCoverFlow } from '../_components/webtoon-cover-flow';
import { Wheel } from '../_components/wheel';

export default function WebtoonPage() {
  return (
    <div className="relative h-full overflow-hidden">
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2">
        <WebtoonCoverFlow />
      </div>
      <Wheel />
    </div>
  );
}
