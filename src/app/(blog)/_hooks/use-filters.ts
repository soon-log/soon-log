import { useSuspenseQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '@/app/(blog)/_constants/query-key';
import { fetchFilters } from '@/app/(blog)/_service/filter';

export const useFilters = () => {
  const { data } = useSuspenseQuery<{ categories: Array<string>; tags: Array<string> }>({
    queryKey: QUERY_KEY.FILTERS,
    queryFn: fetchFilters
  });

  return data;
};
