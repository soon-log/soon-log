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
import { PostMetadata, FilterState } from '@/types/mdx';

interface PostListProps {
  data: PostMetadata[];
}

const POSTS_PER_PAGE = 10;

// 재사용 가능한 필터 섹션 컴포넌트
function FilterSection({
  isFilterOpen,
  onFilterToggle,
  filters,
  availableCategories,
  allPosts,
  onFiltersChange
}: {
  isFilterOpen: boolean;
  onFilterToggle: (isOpen: boolean) => void;
  filters: FilterState;
  availableCategories: string[];
  allPosts: PostMetadata[];
  onFiltersChange: (filters: FilterState) => void;
}) {
  return (
    <Collapsible open={isFilterOpen} onOpenChange={onFilterToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="hidden w-full justify-between md:flex">
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
          allPosts={allPosts}
          onFiltersChange={onFiltersChange}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}

export function PostList({ data }: PostListProps) {
  // 필터바 접힘/펼침 상태
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // URL 동기화 훅 사용
  const { filters, updateFilters } = useFilterUrlSync();

  // 필터링 로직 훅 사용
  const { filteredPosts, availableCategories } = usePostFilter(data, filters);

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

  // 상태별 메시지 결정
  const getEmptyMessage = () => {
    if (data.length === 0) {
      return '아직 작성된 게시물이 없습니다.';
    }
    if (filteredPosts.length === 0) {
      return '필터 조건에 맞는 게시물이 없습니다.';
    }
    return null;
  };

  const emptyMessage = getEmptyMessage();

  return (
    <div className="space-y-6" data-testid="filtered-post-list">
      <FilterSection
        isFilterOpen={isFilterOpen}
        onFilterToggle={setIsFilterOpen}
        filters={filters}
        availableCategories={availableCategories}
        allPosts={data}
        onFiltersChange={handleFiltersChange}
      />

      {/* 빈 상태 메시지 */}
      {emptyMessage && <p className="text-center text-gray-500">{emptyMessage}</p>}

      {/* 게시물 목록 - 필터링된 게시물이 있을 때만 표시 */}
      {filteredPosts.length > 0 && (
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
