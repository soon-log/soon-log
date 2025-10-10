'use client';

import { useQuery } from '@tanstack/react-query';

import { cn } from '@/lib/utils';

import { QUERY_KEY } from '../../_constants/query-key';
import { fetchWebtoons } from '../../_service/webtoons';
import { WebtoonCard } from '../webtoon-card';

export function WebtoonCoverFlow() {
  const { data: webtoons } = useQuery({
    queryKey: QUERY_KEY.WEBTOONS,
    queryFn: () => fetchWebtoons()
  });

  const webtoon = webtoons?.webtoons[0];

  if (!webtoon) {
    return null;
  }

  return (
    <div className="relative flex h-[400px] w-full items-center justify-center perspective-distant">
      <ul className="relative flex h-full w-full items-center justify-center transform-3d">
        <li
          className={cn(
            'absolute z-10 hidden scale-[0.65] transition-all duration-500 md:block',
            'translate-x-[-250px] translate-z-[145px] rotate-y-[-55deg]',
            'brightness-[.20]'
          )}
        >
          <WebtoonCard webtoon={webtoons.webtoons[3]!} />
        </li>
        <li
          className={cn(
            'absolute z-20 scale-75 transition-all duration-500 md:scale-[0.8]',
            'translate-x-[-170px] translate-z-[150px] rotate-y-[-45deg]',
            'brightness-[.50]'
          )}
        >
          <WebtoonCard webtoon={webtoons.webtoons[1]!} />
        </li>
        <li className="absolute z-30 scale-100 transition-all duration-500">
          <WebtoonCard webtoon={webtoons.webtoons[0]!} isActive />
        </li>
        <li
          className={cn(
            'absolute z-20 scale-75 transition-all duration-500 md:scale-[0.8]',
            'translate-x-[170px] translate-z-[150px] rotate-y-[45deg]',
            'brightness-[.50]'
          )}
        >
          <WebtoonCard webtoon={webtoons.webtoons[2]!} />
        </li>
        <li
          className={cn(
            'absolute z-10 hidden scale-75 scale-[0.65] transition-all duration-500 md:block',
            'translate-x-[250px] translate-z-[145px] rotate-y-[55deg]',
            'brightness-[.20]'
          )}
        >
          <WebtoonCard webtoon={webtoons.webtoons[4]!} />
        </li>
      </ul>
    </div>
  );
}
