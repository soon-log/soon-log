import lunr from 'lunr';
import { useState, useEffect, useCallback } from 'react';

import { SearchResult, SearchIndexData } from '@/types/mdx';

interface UseSearchResult {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
}

/**
 * 한글 검색을 위한 쿼리 변환 함수
 * @param query - 사용자 입력 검색어
 * @returns 변환된 검색 쿼리들
 */
function createKoreanSearchQueries(query: string): string[] {
  const trimmedQuery = query.trim().toLowerCase();
  const queries: string[] = [];

  console.log('🔧 쿼리 변환 시작:', trimmedQuery);

  // 1. 원본 쿼리
  queries.push(trimmedQuery);

  // 2. 한글이 포함된 경우 부분 문자열 쿼리 생성
  if (/[가-힣]/.test(trimmedQuery)) {
    console.log('🇰🇷 한글 감지됨');

    // 2글자 이상인 경우 부분 문자열로도 검색
    if (trimmedQuery.length >= 2) {
      // 정확한 매칭을 위한 쿼리
      queries.push(`"${trimmedQuery}"`);

      // 2글자, 3글자 부분 문자열
      for (let len = 2; len <= Math.min(3, trimmedQuery.length); len++) {
        for (let i = 0; i <= trimmedQuery.length - len; i++) {
          const substring = trimmedQuery.substring(i, i + len);
          if (substring.length >= 2) {
            queries.push(substring);
          }
        }
      }
    }
  }

  // 3. 영어인 경우 와일드카드 추가
  if (/^[a-zA-Z]+$/.test(trimmedQuery) && trimmedQuery.length >= 2) {
    console.log('🔤 영어 감지됨, 와일드카드 추가');
    queries.push(`${trimmedQuery}*`);
  }

  const uniqueQueries = [...new Set(queries)]; // 중복 제거
  console.log('📝 최종 검색 쿼리들:', uniqueQueries);
  return uniqueQueries;
}

/**
 * Lunr.js를 사용한 검색 기능을 제공하는 훅
 */
export function useSearch(): UseSearchResult {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchIndex, setSearchIndex] = useState<lunr.Index | null>(null);
  const [searchStore, setSearchStore] = useState<Record<string, any>>({});

  // 검색 인덱스 로드
  useEffect(() => {
    let isMounted = true;

    async function loadSearchIndex() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/data/lunr-index.json');

        if (!response.ok) {
          throw new Error(`검색 인덱스 로드 실패: ${response.status}`);
        }

        const data: SearchIndexData = await response.json();

        if (isMounted) {
          const index = lunr.Index.load(data.index);
          setSearchIndex(index);
          setSearchStore(data.store);
        }
      } catch (err) {
        console.error('검색 인덱스 로드 실패:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : '검색 인덱스 로드에 실패했습니다');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSearchIndex();

    return () => {
      isMounted = false;
    };
  }, []);

  // 검색 실행
  const performSearch = useCallback(
    (searchQuery: string) => {
      if (!searchIndex || !searchQuery.trim()) {
        setResults([]);
        return;
      }

      try {
        const allResults: lunr.Index.Result[] = [];
        const seenResults = new Set<string>();

        console.log('🔍 검색 시작:', searchQuery);

        // 한글 지원 검색 쿼리 생성
        const searchQueries = createKoreanSearchQueries(searchQuery);
        console.log('📝 생성된 검색 쿼리들:', searchQueries);

        // 각 쿼리로 검색 실행
        for (const [index, queryString] of searchQueries.entries()) {
          try {
            const searchResults = searchIndex.search(queryString);
            console.log(`🎯 쿼리 "${queryString}":`, searchResults.length, '개 결과');

            searchResults.forEach((result) => {
              if (!seenResults.has(result.ref)) {
                seenResults.add(result.ref);
                // 첫 번째 쿼리(원본)가 아닌 경우 점수 조정
                if (index > 0) {
                  result.score *= 0.8 - index * 0.1; // 점수 감소
                }
                allResults.push(result);
              }
            });
          } catch (searchError) {
            console.log(`❌ 쿼리 "${queryString}" 검색 실패:`, searchError);
          }
        }

        // 점수순으로 정렬
        allResults.sort((a, b) => b.score - a.score);

        console.log('✅ 최종 결과:', allResults.length, '개');

        // 검색 결과를 실제 게시물 데이터에 매핑
        const mappedResults: SearchResult[] = allResults
          .slice(0, 10) // 상위 10개만
          .map((result) => {
            const post = searchStore[result.ref];
            return {
              key: post.key,
              title: post.title,
              summary: post.summary,
              tags: post.tags || [],
              category: post.category,
              date: post.date,
              score: result.score
            };
          });

        setResults(mappedResults);
      } catch (error) {
        console.error('검색 오류:', error);
        setResults([]);
      }
    },
    [searchIndex, searchStore]
  );

  // 쿼리 변경 시 검색 실행
  useEffect(() => {
    performSearch(query);
  }, [query, performSearch]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error
  };
}
