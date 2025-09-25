import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

import { QUERY_KEY } from '@/app/(blog)/_constants/query-key';

import { MAX_DISPLAY_TAGS, MAX_DROPDOWN_RESULTS } from './constants';
import { useKeywordContext } from './keyword-provider';
import { useOpenContext } from './open-provider';
import { useResultsContext } from './results-provider';
import { fetchSearchIndex, searchPosts } from './search.service';
import { useSelectedIndexContext } from './selected-index-provider';

export function SearchResults() {
  const router = useRouter();
  const resultsRef = useRef<HTMLDivElement>(null);

  const { isOpen, close } = useOpenContext();
  const { keyword } = useKeywordContext();
  const { results, onChangeResults } = useResultsContext();
  const { selectedIndex, onChangeSelectedIndex } = useSelectedIndexContext();

  const { data, isLoading, error } = useSuspenseQuery({
    queryKey: QUERY_KEY.SEARCH_INDEX,
    queryFn: fetchSearchIndex
  });

  const navigateToPostPage = (key: string) => {
    router.push(`/post/${key}`);
    close();
  };

  const performSearch = useCallback(
    (searchQuery: string) => {
      if (!data.index || !searchQuery.trim()) {
        onChangeResults([]);
        return;
      }

      try {
        const mappedResults = searchPosts(
          { index: data.index, store: data.store },
          searchQuery,
          MAX_DROPDOWN_RESULTS
        );
        onChangeResults(mappedResults);
      } catch {
        onChangeResults([]);
      }
    },
    [data.index, data.store, onChangeResults]
  );

  useEffect(() => {
    performSearch(keyword);
  }, [keyword, performSearch]);

  if (!isOpen) return null;

  return (
    <div
      ref={resultsRef}
      className="bg-popover absolute top-full z-50 mt-1 w-full rounded-md border shadow-md"
      role="listbox"
      aria-label="검색 결과"
    >
      {isLoading ? (
        <div className="text-muted-foreground p-4 text-center text-sm">검색 중...</div>
      ) : error ? (
        <div className="text-destructive p-4 text-center text-sm">{error.message}</div>
      ) : results.length > 0 ? (
        <div className="max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <div
              key={result.key}
              role="option"
              aria-selected={index === selectedIndex}
              aria-label={result.title}
              className={`border-border hover:bg-muted cursor-pointer border-b p-3 last:border-b-0 ${
                index === selectedIndex ? 'bg-muted' : ''
              }`}
              onClick={() => navigateToPostPage(result.key)}
              onMouseEnter={() => onChangeSelectedIndex(index)}
            >
              <div className="text-sm font-medium">{result.title}</div>
              {result.summary && (
                <div className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                  {result.summary}
                </div>
              )}
              <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                {result.category && (
                  <span className="bg-secondary rounded px-1.5 py-0.5">{result.category}</span>
                )}
                {result.tags && result.tags.length > 0 && (
                  <span className="flex gap-1">
                    {result.tags.slice(0, MAX_DISPLAY_TAGS).map((tag) => (
                      <span key={tag} className="text-xs">
                        #{tag}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : keyword.trim() ? (
        <div className="text-muted-foreground p-4 text-center text-sm">검색 결과가 없습니다</div>
      ) : null}
    </div>
  );
}
