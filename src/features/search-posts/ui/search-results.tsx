import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';

import { QUERY_KEY } from '@/entities/post';
import { SearchResultsList } from '@/features/search-posts/ui/search-results-list';

import { fetchSearchIndex } from '../api/get-search-index';
import { useKeywordContext } from '../model/keyword-provider';
import { useOpenContext } from '../model/open-provider';
import { useResultsContext } from '../model/results-provider';
import { searchPosts } from '../model/service';

export const MAX_DROPDOWN_RESULTS = 10; // 드롭다운에 표시할 최대 결과 수

export function SearchResults() {
  const resultsRef = useRef<HTMLDivElement>(null);

  const { isOpen } = useOpenContext();
  const { keyword } = useKeywordContext();
  const { results, onChangeResults, reset } = useResultsContext();

  const hasResults = results.length > 0;
  const hasKeyword = keyword.trim().length > 0;

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEY.SEARCH_INDEX],
    queryFn: fetchSearchIndex,
    enabled: !!isOpen
  });

  const performSearch = useCallback(
    (keyword: string) => {
      if (!data) return;
      if (!data.index || !keyword.trim()) {
        reset();
        return;
      }

      try {
        const mappedResults = searchPosts({
          loadedIndex: { index: data.index, store: data.store },
          query: keyword,
          limit: MAX_DROPDOWN_RESULTS
        });
        onChangeResults(mappedResults);
      } catch {
        reset();
      }
    },
    [data, onChangeResults, reset]
  );

  useEffect(() => {
    performSearch(keyword);
  }, [keyword, performSearch]);

  if (!isOpen) return null;

  if (isLoading) return <SearchResultsLoading />;

  if (error) return <SearchResultsError errorMessage={error.message} />;

  if (!hasResults && hasKeyword) return <SearchResultsEmpty />;

  return (
    <div
      ref={resultsRef}
      className="bg-popover absolute top-full z-50 mt-1 w-full rounded-md border shadow-md"
      role="listbox"
      aria-label="검색 결과"
    >
      {hasResults ? <SearchResultsList results={results} /> : null}
    </div>
  );
}

function SearchResultsLoading() {
  return <div className="text-muted-foreground p-4 text-center text-sm">검색 중...</div>;
}

function SearchResultsError({ errorMessage }: { errorMessage: string }) {
  return <div className="text-destructive p-4 text-center text-sm">{errorMessage}</div>;
}

function SearchResultsEmpty() {
  return <div className="text-muted-foreground p-4 text-center text-sm">검색 결과가 없습니다</div>;
}
