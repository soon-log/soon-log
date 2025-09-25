'use client';

import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef } from 'react';

import { QUERY_KEY } from '@/app/(blog)/_constants/query-key';
import { Pagination } from '@/app/(blog)/_types/base';
import { PostMetadata } from '@/app/(blog)/_types/mdx';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { buildAbsoluteUrl } from '@/utils/http';
import { buildPostsQueryString, parsePostsQueryParams } from '@/utils/url';

import { PostCard } from './post-card';

const DEFAULT_PER_PAGE = 10;

async function fetchPostsPage(args: {
  pageParam: number | undefined;
  perPage: number;
  filters: { tags: Array<string>; category: string | null; search: string | null };
}): Promise<Pagination<PostMetadata>> {
  const { pageParam, perPage, filters } = args;
  const params = buildPostsQueryString(filters);
  params.set('page', String(pageParam ?? 1));
  params.set('perPage', String(perPage));

  const res = await fetch(buildAbsoluteUrl(`/api/posts?${params.toString()}`));
  if (!res.ok) {
    throw new Error('게시물 로딩 실패');
  }
  return (await res.json()) as Pagination<PostMetadata>;
}

export function PostList() {
  const searchParams = useSearchParams();
  const { tags, category, search } = parsePostsQueryParams(searchParams);

  const perPage = DEFAULT_PER_PAGE;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useSuspenseInfiniteQuery({
      queryKey: QUERY_KEY.POSTS({ tags, category, search, perPage }),
      queryFn: ({ pageParam }) =>
        fetchPostsPage({ pageParam, perPage, filters: { tags, category, search } }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage
    });

  const allPosts = useMemo(() => data.pages.flatMap((page) => page.results), [data.pages]);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useInfiniteScroll({
    targetRef: loadMoreRef,
    onIntersect: handleIntersect,
    isLoading: isFetching
  });

  return (
    <div className="space-y-6">
      {allPosts.length === 0 ? (
        <p className="text-center text-gray-500">게시물이 없습니다.</p>
      ) : (
        <div>
          <ul className="flex flex-col gap-4 pb-10">
            {allPosts.map((post) => (
              <li key={post.key}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
          {hasNextPage && <div ref={loadMoreRef} className="flex justify-center py-8" />}
        </div>
      )}
    </div>
  );
}
