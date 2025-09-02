'use client';

import { isEqual } from 'es-toolkit';
import { useSearchParams } from 'next/navigation';
import { useState, useRef, useCallback, useEffect } from 'react';

import { PostCard } from '@/app/_components/post-list/post-card';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { parsePostsQueryParams } from '@/lib/url';
import { Pagination } from '@/types/base';
import { FilterState, PostMetadata } from '@/types/mdx';

interface PostListProps {
  posts: Pagination<PostMetadata>;
}

export function PostList({ posts }: PostListProps) {
  const searchParams = useSearchParams();
  const [allPosts, setAllPosts] = useState<Array<PostMetadata>>(posts.results);
  const [nextPage, setNextPage] = useState<number | null>(posts.nextPage);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const prevFilters = useRef<FilterState | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const perPage = posts.perPage || 10;
  const hasMore = nextPage !== null;

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      const { tags, category, search } = parsePostsQueryParams(searchParams);

      if (tags?.length > 0) params.set('tags', tags.join(','));
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      params.set('page', String(nextPage));
      params.set('perPage', String(perPage));

      const res = await fetch(`/api/posts?${params.toString()}`);
      const data: Pagination<PostMetadata> = await res.json();

      setAllPosts((prev) => [...prev, ...data.results]);
      setNextPage(data.nextPage);

      // URL 동기화(네비게이션 없이)
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('page', String(data.page));
        url.searchParams.set('perPage', String(perPage));
        window.history.replaceState(null, '', url.toString());
      }
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, nextPage, perPage, searchParams]);

  useInfiniteScroll({ targetRef: loadMoreRef, onIntersect: loadMore, isLoading });

  // 새로고침 시 page를 1로 초기화
  useEffect(() => {
    const pageParam = searchParams.get('page');
    const initialPage = pageParam ? parseInt(pageParam) : posts.page;

    if (initialPage > 1) {
      (async () => {
        setIsLoading(true);
        try {
          const params = new URLSearchParams();

          const tags = searchParams.get('tags');
          const category = searchParams.get('category');
          const search = searchParams.get('search');

          if (tags) params.set('tags', tags);
          if (category) params.set('category', category);
          if (search) params.set('search', search);

          params.set('page', '1');
          params.set('perPage', String(perPage));

          const res = await fetch(`/api/posts?${params.toString()}`);
          const data: Pagination<PostMetadata> = await res.json();

          setAllPosts(data.results);
          setNextPage(data.nextPage);

          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('page', '1');
            url.searchParams.set('perPage', String(perPage));
            window.history.replaceState(null, '', url.toString());
          }
        } finally {
          setIsLoading(false);
        }
      })();
    }
    // 의도적으로 최초 마운트 시에만 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { tags, category, search } = parsePostsQueryParams(searchParams);
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
  }, [searchParams, posts]);

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
