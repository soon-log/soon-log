'use client';

import { useQuery } from '@tanstack/react-query';

import { cn } from '@/lib/utils';

import { QUERY_KEY } from '../../_constants/query-key';
import { fetchWebtoons } from '../../_service/webtoons';
import { WebtoonCard } from '../webtoon-card';

export function WebtoonCoverFlow() {
  const { data } = useQuery({
    queryKey: QUERY_KEY.WEBTOONS,
    queryFn: () => fetchWebtoons()
  });

  if (!data) {
    return null;
  }

  return (
    <div className="relative flex h-[500px] w-full items-center justify-center perspective-distant">
      <ul className="relative flex h-full w-full items-center justify-center transform-3d">
        <li
          className={cn(
            'absolute hidden scale-[0.65] transition-all duration-500 select-none md:block',
            'translate-x-[-250px] translate-z-[145px] rotate-y-[-55deg]',
            'brightness-[.20]'
          )}
        >
          <WebtoonCard webtoon={data.webtoons[3]!} />
        </li>
        <li
          className={cn(
            'absolute scale-75 transition-all duration-500 md:scale-[0.8]',
            'translate-x-[-170px] translate-z-[150px] rotate-y-[-45deg]',
            'brightness-[.50]'
          )}
        >
          <WebtoonCard webtoon={data.webtoons[1]!} />
        </li>
        <li className="absolute scale-100 transition-all duration-500">
          <WebtoonCard webtoon={data.webtoons[0]!} isActive />
        </li>
        <li
          className={cn(
            'absolute scale-75 transition-all duration-500 md:scale-[0.8]',
            'translate-x-[170px] translate-z-[150px] rotate-y-[45deg]',
            'brightness-[.50]'
          )}
        >
          <WebtoonCard webtoon={data.webtoons[2]!} />
        </li>
        <li
          className={cn(
            'absolute hidden scale-75 scale-[0.65] transition-all duration-500 md:block',
            'translate-x-[250px] translate-z-[145px] rotate-y-[55deg]',
            'brightness-[.20]'
          )}
        >
          <WebtoonCard webtoon={data.webtoons[4]!} />
        </li>
      </ul>
    </div>
  );
}
