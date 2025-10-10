import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';

import { DAY_OF_WEEK } from '../../_constants/day-of-week';
import { PLATFORM } from '../../_constants/platform';
import { Webtoon } from '../../_types/webtoon';

export function BackSide({ webtoon }: { webtoon: Webtoon }) {
  return (
    <div className="flip-card absolute h-full w-full overflow-hidden rounded-[5px] backface-hidden">
      <Image
        src={webtoon.thumbnail}
        alt={`${webtoon.title} 썸네일`}
        fill
        priority
        sizes="190px"
        unoptimized
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black opacity-60" />

      <div className="absolute flex h-full w-full flex-col justify-between p-2.5">
        <div className="flex gap-1">
          <Badge className="w-fit rounded-[10px] bg-white px-[4px] py-[1px] text-[8px] text-black">
            {PLATFORM[webtoon.platform].label}
          </Badge>
          {webtoon.dayOfWeek && (
            <Badge className="w-fit rounded-[10px] bg-white px-[4px] py-[1px] text-[8px] text-black">
              {DAY_OF_WEEK[webtoon.dayOfWeek].label}
            </Badge>
          )}
        </div>

        <div className="flex w-full items-center justify-between gap-2 rounded-[5px] bg-black/60 p-2.5 shadow-[0px_0px_10px_5px_rgba(0,0,0,0.53)] backdrop-blur-[5px]">
          <div className="flex-1 overflow-hidden">
            <p className="line-clamp-2 text-[12px] text-white">{webtoon.title}</p>
            <p className="mt-1.5 text-[8px] text-[rgba(255,255,255,0.53)]">{webtoon.author}</p>
          </div>

          <a
            href={webtoon.link}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex h-auto items-center justify-center rounded-md p-1 text-white transition-colors hover:bg-white/10"
            aria-label={`${webtoon.title} 웹툰 페이지로 이동`}
          >
            <ExternalLink size={20} />
          </a>
        </div>
      </div>
    </div>
  );
}
