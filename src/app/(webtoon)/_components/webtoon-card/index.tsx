'use client';
import { useQuery } from '@tanstack/react-query';

import { cn } from '@/lib/utils';

import { QUERY_KEY } from '../../_constants/query-key';
import { fetchWebtoons } from '../../_service/webtoons';

import { BackSide } from './back-side';
import { FrontSide } from './front-side';

export function WebtoonCard({ className }: { className?: string }) {
  const { data: webtoons } = useQuery({
    queryKey: QUERY_KEY.WEBTOONS,
    queryFn: () => fetchWebtoons()
  });

  const webtoon = webtoons?.webtoons[0];

  if (!webtoon) {
    return null;
  }

  return (
    <div className={cn('group h-[300px] w-[240px] overflow-visible', className)}>
      <div className="webtoon-flip-card preserve-3d h-full w-full">
        <FrontSide title={webtoon.title} thumbnail={webtoon.thumbnail} />
        <BackSide webtoon={webtoon} />
      </div>
    </div>
  );
}
