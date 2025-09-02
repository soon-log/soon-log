'use client';

import { isEqual } from 'es-toolkit';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef, useCallback, useEffect } from 'react';

import { PostCard } from '@/app/_components/post-list/post-card';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { buildPostsQueryString, parsePostsQueryParams } from '@/lib/url';
import { Pagination } from '@/types/base';
import { FilterState, PostMetadata } from '@/types/mdx';

interface PostListProps {
  posts: Pagination<PostMetadata>;
}

export function PostList({ posts }: PostListProps) {
  const searchParams = useSearchParams();
  const { tags, category, search } = parsePostsQueryParams(searchParams);

  const router = useRouter();
  const [allPosts, setAllPosts] = useState<Array<PostMetadata>>(posts.results);
  const [nextPage, setNextPage] = useState<number | null>(posts.nextPage);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const prevFilters = useRef<FilterState | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const perPage = posts.perPage || 10;
  const hasMore = nextPage !== null;

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    try {
      setIsLoading(true);

      const params = buildPostsQueryString({ tags, category, search });

      params.set('page', String(nextPage));
      params.set('perPage', String(perPage));

      const res = await fetch(`/api/posts?${params.toString()}`);
      const data: Pagination<PostMetadata> = await res.json();

      setAllPosts((prev) => [...prev, ...data.results]);
      setNextPage(data.nextPage);
      router.replace(`/?${params.toString()}`, { scroll: false });
    } finally {
      setIsLoading(false);
    }
  }, [category, hasMore, isLoading, nextPage, perPage, router, search, tags]);

  // 새로고침 시 page를 1로 초기화
  useEffect(() => {
    const pageParam = searchParams.get('page');

    if (pageParam && parseInt(pageParam) > 1) {
      (async () => {
        try {
          setIsLoading(true);

          const params = buildPostsQueryString({ tags, category, search });

          params.delete('page');
          params.delete('perPage');

          const res = await fetch(`/api/posts?${params.toString()}`);
          const data: Pagination<PostMetadata> = await res.json();

          setAllPosts(data.results);
          setNextPage(data.nextPage);

          router.replace(`/?${params.toString()}`, { scroll: false });
        } finally {
          setIsLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (prevFilters.current === null) {
      prevFilters.current = { tags, category, search };
    } else {
      const { tags: prevTags, category: prevCategory, search: prevSearch } = prevFilters.current;
      if (
        isEqual(tags, prevTags) &&
        isEqual(category, prevCategory) &&
        isEqual(search, prevSearch)
      ) {
        return;
      }
      setAllPosts(posts.results);
      setNextPage(posts.nextPage);
      prevFilters.current = { tags, category, search };
    }
  }, [searchParams, posts, tags, category, search]);

  useInfiniteScroll({ targetRef: loadMoreRef, onIntersect: loadMore, isLoading });

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
          {hasMore && <div ref={loadMoreRef} className="flex justify-center py-8" />}
        </div>
      )}
    </div>
  );
}
