'use client';

import { useMemo } from 'react';

import { Webtoon } from '@/app/(webtoon)/_types/webtoon';
import { cn } from '@/lib/utils';

import { WebtoonCard } from '../webtoon-card';
import { useWheelContext } from '../wheel/wheel-provider';

const useCoverFlow = ({ webtoons }: { webtoons: Webtoon[] }) => {
  const { cardIndex, isDragging } = useWheelContext();
  const slicedWebtoons = useMemo(() => {
    const length = webtoons.length;

    if (length === 0) {
      return [];
    }

    return Array.from({ length: 5 }, (_, i) => {
      const offset = 2 - i;
      const index = (((cardIndex + offset) % length) + length) % length;
      return webtoons[index];
    });
  }, [webtoons, cardIndex]);

  return { slicedWebtoons, isDragging };
};

export function WebtoonCoverFlow({ webtoons }: { webtoons: Webtoon[] }) {
  const { slicedWebtoons, isDragging } = useCoverFlow({ webtoons });

  if (!slicedWebtoons?.length) {
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
          <WebtoonCard webtoon={slicedWebtoons[0]!} />
        </li>
        <li
          className={cn(
            'absolute scale-75 transition-all duration-500 md:scale-[0.8]',
            'translate-x-[-170px] translate-z-[150px] rotate-y-[-45deg]',
            'brightness-[.50]'
          )}
        >
          <WebtoonCard webtoon={slicedWebtoons[1]!} />
        </li>
        <li className="absolute scale-100 transition-all duration-500">
          <WebtoonCard webtoon={slicedWebtoons[2]!} isActive={!isDragging} />
        </li>
        <li
          className={cn(
            'absolute scale-75 transition-all duration-500 md:scale-[0.8]',
            'translate-x-[170px] translate-z-[150px] rotate-y-[45deg]',
            'brightness-[.50]'
          )}
        >
          <WebtoonCard webtoon={slicedWebtoons[3]!} />
        </li>
        <li
          className={cn(
            'absolute hidden scale-75 scale-[0.65] transition-all duration-500 md:block',
            'translate-x-[250px] translate-z-[145px] rotate-y-[55deg]',
            'brightness-[.20]'
          )}
        >
          <WebtoonCard webtoon={slicedWebtoons[4]!} />
        </li>
      </ul>
    </div>
  );
}
