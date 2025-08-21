'use client';

import { useState, useRef, useMemo } from 'react';

import { PostCard } from '@/components/post-card';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { PostMetadata } from '@/types/mdx';

interface PostListProps {
  posts: PostMetadata[];
}

const POSTS_PER_PAGE = 10;

export function PostList({ posts }: PostListProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const visiblePosts = useMemo(() => {
    return posts.slice(0, visibleCount);
  }, [posts, visibleCount]);

  const hasMore = visibleCount < posts.length;
  const isLoading = hasMore && visiblePosts.length < visibleCount;

  const loadMore = () => {
    if (hasMore) {
      setVisibleCount((prev) => Math.min(prev + POSTS_PER_PAGE, posts.length));
    }
  };

  useInfiniteScroll(loadMoreRef, loadMore);

  // 상태별 메시지 결정
  const getEmptyMessage = () => {
    if (posts.length === 0) {
      return '아직 작성된 게시물이 없습니다.';
    }
    if (posts.length === 0) {
      return '필터 조건에 맞는 게시물이 없습니다.';
    }
    return null;
  };

  const emptyMessage = getEmptyMessage();

  return (
    <div className="space-y-6" data-testid="filtered-post-list">
      {emptyMessage && <p className="text-center text-gray-500">{emptyMessage}</p>}

      {posts.length > 0 && (
        <div>
          <ul className="flex flex-col gap-4">
            {visiblePosts.map((post) => (
              <li key={post.key}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>

          {/* 무한 스크롤 트리거 */}
          {hasMore && (
            <div
              ref={loadMoreRef}
              className="flex justify-center py-8"
              data-testid="load-more-trigger"
            >
              {isLoading ? (
                <p className="text-muted-foreground">더 많은 게시물 로드 중...</p>
              ) : (
                <p className="text-muted-foreground">스크롤하여 더 많은 게시물 보기</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
