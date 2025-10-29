'use client';

import { cn } from '@/shared/lib';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

import type { FilterType } from '../../_types/webtoon';

import { FILTER_CONFIG } from './constants';
import { useToggleFilter } from './use-toggle-filter';

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
