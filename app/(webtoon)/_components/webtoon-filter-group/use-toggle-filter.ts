import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import type { FilterType } from '../../_types/webtoon';

type UseToggleFilterProps = {
  type: FilterType;
};

export const useToggleFilter = ({ type }: UseToggleFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentType = searchParams?.get('type');
  const isChecked = currentType === type;

  const onToggle = useCallback(() => {
    const params = new URLSearchParams(searchParams?.toString() || '');

    if (isChecked) {
      params.delete('type');
    } else {
      params.set('type', type);
    }

    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`);
  }, [searchParams, isChecked, router, type, pathname]);

  return { isChecked, onToggle };
};
