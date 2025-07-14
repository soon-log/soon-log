import { useMemo } from 'react';

import { PostMetadata, FilterState, PostFilterHookResult } from '@/types/mdx';

export function usePostFilter(
  allPosts: PostMetadata[],
  filters: FilterState
): PostFilterHookResult {
  // 사용 가능한 카테고리 목록을 계산
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    for (const post of allPosts) {
      if (post.category) {
        categories.add(post.category);
      }
    }
    return Array.from(categories).sort();
  }, [allPosts]);

  // 사용 가능한 태그 목록을 계산
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    for (const post of allPosts) {
      if (post.tags) {
        for (const tag of post.tags) {
          tags.add(tag);
        }
      }
    }
    return Array.from(tags).sort();
  }, [allPosts]);

  // 필터링된 게시물 계산
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      // 카테고리 필터링
      if (filters.category && post.category !== filters.category) {
        return false;
      }

      // 태그 필터링 - 선택된 모든 태그가 포스트에 포함되어야 함
      if (filters.tags && filters.tags.length > 0) {
        const hasAllTags = filters.tags.every((tag) => post.tags?.includes(tag));
        if (!hasAllTags) return false;
      }

      // 검색 필터링 - 제목이나 요약에서 검색어 찾기
      if (filters.search && filters.search.trim() !== '') {
        const searchTerm = filters.search.toLowerCase();
        const titleMatch = post.title.toLowerCase().includes(searchTerm);
        const summaryMatch = post.summary?.toLowerCase().includes(searchTerm) ?? false;

        if (!titleMatch && !summaryMatch) {
          return false;
        }
      }

      return true;
    });
  }, [filters, allPosts]);

  return {
    filteredPosts,
    availableCategories,
    availableTags
  };
}
