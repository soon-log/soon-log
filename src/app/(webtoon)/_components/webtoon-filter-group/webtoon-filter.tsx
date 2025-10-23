'use client';

import { useToggleFilter } from '@/app/(webtoon)/_components/webtoon-filter-group/use-toggle-filter';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

import { FILTER_CONFIG, FilterType } from './constants';

export function WebtoonFilter({ type }: { type: FilterType }) {
  const { isChecked, onToggle } = useToggleFilter({ type });
  const config = FILTER_CONFIG[type];

  return (
    <Avatar
      className={cn(
        'h-12 w-12 cursor-pointer transition-all duration-200',
        isChecked && `shadow-lg ${config.shadowColor}`
      )}
      onClick={onToggle}
      role="checkbox"
    >
      <AvatarImage src={config.src} alt={`${type} filter`} />
      <AvatarFallback className={config.bgColor}>{config.fallback}</AvatarFallback>
    </Avatar>
  );
}
