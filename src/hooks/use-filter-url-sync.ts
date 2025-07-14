import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import { FilterState } from '@/types/mdx';

interface FilterUrlSyncResult {
  filters: FilterState;
  updateFilters: (filters: FilterState) => void;
}

export function useFilterUrlSync(): FilterUrlSyncResult {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 초기 필터 상태 추출
  const getFiltersFromUrl = useCallback((): FilterState => {
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const tagsParam = searchParams.get('tags');

    let tags: string[] = [];
    if (tagsParam && tagsParam.trim() !== '') {
      tags = tagsParam
        .split(',')
        .map((tag) => decodeURIComponent(tag.trim()))
        .filter(Boolean);
    }

    return { category, tags, search };
  }, [searchParams]);

  const [filters, setFilters] = useState<FilterState>(getFiltersFromUrl);

  // URL 파라미터가 변경될 때 필터 상태 업데이트
  useEffect(() => {
    setFilters(getFiltersFromUrl());
  }, [getFiltersFromUrl]);

  // 필터 상태를 URL에 반영하는 함수
  const updateFilters = useCallback(
    (newFilters: FilterState) => {
      setFilters(newFilters);

      const urlParts: string[] = [];

      if (newFilters.category) {
        urlParts.push(`category=${encodeURIComponent(newFilters.category)}`);
      }

      if (newFilters.tags && newFilters.tags.length > 0) {
        const tagsString = newFilters.tags.map((tag) => encodeURIComponent(tag)).join(',');
        urlParts.push(`tags=${tagsString}`);
      }

      if (newFilters.search && newFilters.search.trim() !== '') {
        urlParts.push(`search=${encodeURIComponent(newFilters.search)}`);
      }

      const queryString = urlParts.length > 0 ? urlParts.join('&') : '';
      const url = queryString ? `?${queryString}` : '?';

      router.replace(url);
    },
    [router]
  );

  return { filters, updateFilters };
}
