'use client';

import { ChevronDown } from 'lucide-react';
import { useState, useRef, useMemo } from 'react';

import { FilterBar } from '@/components/filter-bar';
import { PostCard } from '@/components/post-card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useFilterUrlSync } from '@/hooks/use-filter-url-sync';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { usePostFilter } from '@/hooks/use-post-filter';
import { PostMetadata } from '@/types/mdx';

interface FilteredPostListProps {
  initialPosts: PostMetadata[];
}

const POSTS_PER_PAGE = 10;

export function FilteredPostList({ initialPosts }: FilteredPostListProps) {
  // 필터바 접힘/펼침 상태
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // URL 동기화 훅 사용
  const { filters, updateFilters } = useFilterUrlSync();

  // 필터링 로직 훅 사용
  const { filteredPosts, availableCategories } = usePostFilter(initialPosts, filters);

  // 무한 스크롤 상태
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 보이는 게시물 계산
  const visiblePosts = useMemo(() => {
    return filteredPosts.slice(0, visibleCount);
  }, [filteredPosts, visibleCount]);

  const hasMore = visibleCount < filteredPosts.length;
  const isLoading = hasMore && visiblePosts.length < visibleCount;

  const loadMore = () => {
    if (hasMore) {
      setVisibleCount((prev) => Math.min(prev + POSTS_PER_PAGE, filteredPosts.length));
    }
  };

  useInfiniteScroll(loadMoreRef, loadMore);

  // 필터 변경 핸들러
  const handleFiltersChange = (newFilters: typeof filters) => {
    updateFilters(newFilters);
    setVisibleCount(POSTS_PER_PAGE); // 필터 변경 시 페이지네이션 리셋
  };

  // 게시물이 없는 경우
  if (initialPosts.length === 0) {
    return (
      <div className="space-y-6">
        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              필터 옵션
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <FilterBar
              filters={filters}
              availableCategories={availableCategories}
              allPosts={initialPosts}
              onFiltersChange={handleFiltersChange}
            />
          </CollapsibleContent>
        </Collapsible>
        <p className="text-center text-gray-500">아직 작성된 게시물이 없습니다.</p>
      </div>
    );
  }

  // 필터링된 게시물이 없는 경우
  if (filteredPosts.length === 0) {
    return (
      <div className="space-y-6">
        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              필터 옵션
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <FilterBar
              filters={filters}
              availableCategories={availableCategories}
              allPosts={initialPosts}
              onFiltersChange={handleFiltersChange}
            />
          </CollapsibleContent>
        </Collapsible>
        <p className="text-center text-gray-500">필터 조건에 맞는 게시물이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 접을 수 있는 필터바 */}
      <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            필터 옵션
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <FilterBar
            filters={filters}
            availableCategories={availableCategories}
            allPosts={initialPosts}
            onFiltersChange={handleFiltersChange}
          />
        </CollapsibleContent>
      </Collapsible>

      {/* 필터링된 게시물 목록 */}
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
    </div>
  );
}
