'use client';

import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef, type RefObject } from 'react';

import {
  QUERY_KEY,
  getPaginatedPosts,
  parsePostsQueryParams,
  type PostMetadata
} from '@/entities/post';
import { useInfiniteScroll } from '@/shared/hooks';

const DEFAULT_PER_PAGE = 10;

type UsePostListResult = {
  posts: Array<PostMetadata>;
  hasNextPage: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  loadMoreRef: RefObject<HTMLDivElement | null>;
};

export function usePostList(perPage = DEFAULT_PER_PAGE): UsePostListResult {
  const searchParams = useSearchParams() as URLSearchParams;
  const filterState = parsePostsQueryParams(searchParams);

  const query = useSuspenseInfiniteQuery({
    queryKey: QUERY_KEY.POSTS({ ...filterState, perPage }),
    queryFn: ({ pageParam }) => getPaginatedPosts({ pageParam, perPage, filterState }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage
  });

  const posts = useMemo(() => query.data.pages.flatMap((page) => page.results), [query.data.pages]);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query]);

  useInfiniteScroll({
    targetRef: loadMoreRef,
    onIntersect: handleIntersect,
    isLoading: query.isFetching
  });

  return {
    posts,
    hasNextPage: Boolean(query.hasNextPage),
    isFetching: query.isFetching,
    isFetchingNextPage: query.isFetchingNextPage,
    loadMoreRef
  };
}
