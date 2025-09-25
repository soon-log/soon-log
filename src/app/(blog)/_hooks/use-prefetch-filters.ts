import { useEffect } from 'react';

import { QUERY_KEY } from '@/app/(blog)/_constants/query-key';
import { fetchFilters } from '@/app/(blog)/_service/filter';
import { queryClient } from '@/lib/react-query';

// 필터 데이터 미리 가져오기
export const usePrefetchFilters = () => {
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEY.FILTERS,
      queryFn: fetchFilters
    });
  }, []);
};
