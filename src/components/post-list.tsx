'use client';

import { useState, useRef, useMemo } from 'react';

import { PostCard } from '@/components/post-card';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { PostMetadata } from '@/types/mdx';

interface PostListProps {
  initialPosts: PostMetadata[];
}

const POSTS_PER_PAGE = 10;

export function PostList({ initialPosts }: PostListProps) {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const visiblePosts = useMemo(() => {
    return initialPosts.slice(0, visibleCount);
  }, [initialPosts, visibleCount]);

  const hasMore = visibleCount < initialPosts.length;
  const isLoading = hasMore && visiblePosts.length < visibleCount;

  const loadMore = () => {
    if (hasMore) {
      setVisibleCount((prev) => Math.min(prev + POSTS_PER_PAGE, initialPosts.length));
    }
  };

  useInfiniteScroll(loadMoreRef, loadMore);

  if (initialPosts.length === 0) {
    return <p className="text-center text-gray-500">아직 작성된 게시물이 없습니다.</p>;
  }

  return (
    <>
      <ul className="flex flex-col gap-4">
        {visiblePosts.map((post) => (
          <li key={post.key}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>

      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-8" data-testid="load-more-trigger">
          {isLoading ? (
            <p className="text-muted-foreground">더 많은 게시물 로드 중...</p>
          ) : (
            <p className="text-muted-foreground">스크롤하여 더 많은 게시물 보기</p>
          )}
        </div>
      )}
    </>
  );
}
