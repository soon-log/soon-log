import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { useState, useEffect, useCallback, useMemo } from 'react';

import { PostFilterState } from '@/entities/post';

interface QueryFiltersResult {
  filters: PostFilterState;
  updateFilters: (filters: PostFilterState) => void;
}

export function useQueryFilters(): QueryFiltersResult {
  const router = useRouter();
  const searchParams = useSearchParams() as URLSearchParams;
  const pathname = usePathname() || '';

  const filtersFromUrl = useMemo((): PostFilterState => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const tagsParam = searchParams.get('tags') || ''; // ex) tags=성능최적화,JavaScript

    let tags: Array<string> = [];
    if (tagsParam && tagsParam.trim() !== '') {
      tags = tagsParam
        .split(',')
        .map((tag) => decodeURIComponent(tag.trim()))
        .filter(Boolean);
    }

    return { category, tags, search };
  }, [searchParams]);

  const [filters, setFilters] = useState<PostFilterState>(filtersFromUrl);

  const updateFilters = useCallback(
    (newFilters: PostFilterState) => {
      setFilters(newFilters);

      const query: Record<string, string> = {};

      if (newFilters.category) {
        query.category = encodeURIComponent(newFilters.category); // '검색어'를 인코딩 -> 예) 검색어 -> %EA%B2%80%EC%83%89%EC%96%B4
      }

      if (newFilters.tags && newFilters.tags.length > 0) {
        const tagsString = newFilters.tags.map((tag) => encodeURIComponent(tag)).join(',');
        query.tags = tagsString;
      }

      if (newFilters.search && newFilters.search.trim() !== '') {
        query.search = encodeURIComponent(newFilters.search);
      }

      const queryString = qs.stringify(query);
      const url = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(url);
    },
    [router, pathname]
  );

  useEffect(() => {
    setFilters(filtersFromUrl);
  }, [filtersFromUrl]);

  return { filters, updateFilters };
}
