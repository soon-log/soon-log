import lunr from 'lunr';

import { buildAbsoluteUrl } from '@/lib/http';
import { createEnhancedSearchQueries } from '@/lib/search';
import { SearchIndexData, SearchResult } from '@/types/mdx';

export type LoadedSearchIndex = {
  index: lunr.Index;
  store: SearchIndexData['store'];
};

export function mapLunrResultsToPosts(
  allResults: Array<lunr.Index.Result>,
  store: SearchIndexData['store'],
  limit: number
): Array<SearchResult> {
  return allResults
    .slice(0, limit)
    .map((result) => {
      const post = store[result.ref];
      if (!post) return null;
      return {
        key: post.key,
        title: post.title,
        summary: post.summary,
        tags: post.tags || [],
        category: post.category,
        date: post.date,
        score: result.score
      } as SearchResult;
    })
    .filter(Boolean) as Array<SearchResult>;
}

export function searchPosts(
  loadedIndex: LoadedSearchIndex,
  query: string,
  limit: number
): Array<SearchResult> {
  const { index, store } = loadedIndex;

  if (!index || !query.trim()) return [];

  const allResults: Array<lunr.Index.Result> = [];
  const seenRefs = new Set<string>();

  const queries = createEnhancedSearchQueries(query);

  for (const [queryIndex, queryString] of queries.entries()) {
    try {
      const results = index.search(queryString);
      for (const result of results) {
        if (seenRefs.has(result.ref)) continue;
        seenRefs.add(result.ref);
        if (queryIndex > 0) {
          result.score *= 0.8 - queryIndex * 0.1;
        }
        allResults.push(result);
      }
    } catch {
      // ignore malformed query for lunr
    }
  }

  allResults.sort((a, b) => b.score - a.score);

  return mapLunrResultsToPosts(allResults, store, limit);
}

export async function fetchSearchIndex(): Promise<LoadedSearchIndex> {
  const response = await fetch(buildAbsoluteUrl('/data/lunr-index.json'));
  if (!response.ok) {
    throw new Error(`검색 인덱스 로드 실패: ${response.status}`);
  }
  const data: SearchIndexData = await response.json();
  return {
    index: lunr.Index.load(data.index),
    store: data.store
  } as LoadedSearchIndex;
}
