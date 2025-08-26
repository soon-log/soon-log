import { FilterState, PostMetadata } from '@/types/mdx';

import { PostsData } from './types';

/**
 * URL 검색 파라미터에서 posts 필터링 조건을 파싱합니다.
 */
export function parsePostsQueryParams(searchParams: URLSearchParams): FilterState {
  const tags = (searchParams.get('tags')?.split(',') || []).map((tag) => decodeURIComponent(tag));
  const category = searchParams.get('category');
  const decodedCategory = typeof category === 'string' ? decodeURIComponent(category) : null;
  const search = searchParams.get('search');
  const decodedSearch = typeof search === 'string' ? decodeURIComponent(search) : null;

  return {
    tags,
    category: decodedCategory,
    search: decodedSearch
  };
}

/**
 * 게시물 배열을 날짜 기준 최신순으로 정렬합니다.
 */
export function sortPostsByDate(posts: PostMetadata[]): PostMetadata[] {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * 카테고리별로 구조화된 posts 데이터를 평탄화합니다.
 */
export function flattenPostsData(data: PostsData): PostMetadata[] {
  return Object.values(data).flat();
}

/**
 * 필터 조건에 맞는 게시물을 추출합니다.
 * @param posts 게시물 배열
 * @param filters 필터 조건
 * @returns 필터 조건에 맞는 게시물 배열
 */
export const filterPosts = ({
  posts,
  filters
}: {
  posts: PostMetadata[];
  filters: FilterState;
}): PostMetadata[] => {
  return posts.filter((post) => {
    if (filters.category && post.category !== filters.category) {
      return false;
    }

    if (filters.tags.length > 0) {
      const hasAllTags = filters.tags.every((tag) => post.tags?.includes(tag));
      if (!hasAllTags) return false;
    }

    if (filters.search && filters.search.trim() !== '') {
      const searchTerm = filters.search.toLowerCase();
      const titleMatch = post.title.toLowerCase().includes(searchTerm);
      const summaryMatch = post.summary?.toLowerCase().includes(searchTerm);

      if (!(titleMatch || summaryMatch)) {
        return false;
      }
    }

    return true;
  });
};
