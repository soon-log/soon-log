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
            'absolute hidden scale-[0.65] transition-all duration-500 md:block',
            'translate-x-[-130%] translate-z-[-100px] rotate-y-[-45deg]'
          )}
        >
          <WebtoonCard webtoon={webtoons.webtoons[3]!} />
        </li>
        <li
          className={cn(
            'absolute scale-75 transition-all duration-500 md:scale-[0.8]',
            'translate-x-[-75%] translate-z-[-50px] rotate-y-[-25deg]'
          )}
        >
          <WebtoonCard webtoon={webtoons.webtoons[1]!} />
        </li>
        <li className="relative z-10 scale-100 transition-all duration-500">
          <WebtoonCard webtoon={webtoons.webtoons[0]!} isActive />
        </li>
        <li
          className={cn(
            'absolute z-0 scale-75 transition-all duration-500 md:scale-[0.8]',
            'translate-x-[75%] translate-z-[-50px] rotate-y-[25deg]'
          )}
        >
          <WebtoonCard webtoon={webtoons.webtoons[2]!} />
        </li>
        <li
          className={cn(
            'absolute -z-10 hidden scale-75 scale-[0.65] transition-all duration-500 md:block',
            'translate-x-[120%] translate-z-[-100px] rotate-y-[45deg]'
          )}
        >
          <WebtoonCard webtoon={webtoons.webtoons[4]!} />
        </li>
      </ul>
    </div>
  );
}
