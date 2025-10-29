import { cn } from '@/shared/lib';

import { WEBTOON_FILTER } from '../../_constants/webtoon-filter';
import type { FilterType } from '../../_types/webtoon';

import { WebtoonFilter } from './webtoon-filter';

export function WebtoonFilterGroup() {
  return (
    <div className="group fixed top-110 right-4 md:top-auto md:right-6 md:bottom-6">
      <button className="text-foreground h-12 w-12 rounded-full bg-[#3d383c]">+</button>
      <ul
        className={cn(
          'flex gap-5 opacity-0 transition-all group-hover:opacity-100 md:flex-col-reverse',
          'absolute right-17 bottom-[50%] translate-y-[50%] md:right-0 md:bottom-16 md:translate-y-0'
        )}
      >
        {Object.values(WEBTOON_FILTER).map((type: FilterType) => (
          <li key={type}>
            <WebtoonFilter type={type} />
          </li>
        ))}
      </ul>
    </div>
  );
}
