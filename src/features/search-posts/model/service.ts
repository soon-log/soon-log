import lunr from 'lunr';

import { SearchResult } from '@/entities/post';

import { createEnhancedSearchQueries, mapLunrResultsToPosts } from './lib';
import { LoadedSearchIndex } from './types';

export function searchPosts({
  loadedIndex,
  query,
  limit
}: {
  loadedIndex: LoadedSearchIndex;
  query: string;
  limit: number;
}): Array<SearchResult> {
  const { index, store } = loadedIndex;
  if (!index || !query.trim()) return [];

  const allResults: Array<lunr.Index.Result> = [];
  const seenRefs = new Set<string>();
  const queries = createEnhancedSearchQueries(query);

  for (const query of queries) {
    try {
      const results = index.search(query);
      for (const result of results) {
        if (seenRefs.has(result.ref)) continue;
        seenRefs.add(result.ref);

        allResults.push(result);
      }
    } catch {
      console.error('[Search Posts] 해당 검색어는 검색 인덱스에 없습니다. : ', query);
    }
  }

  allResults.sort((a, b) => b.score - a.score);

  return mapLunrResultsToPosts({ allResults, store, limit });
}
