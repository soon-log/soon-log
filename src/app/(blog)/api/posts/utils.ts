import { Pagination } from '@/types/base';
import { FilterState, PostMetadata } from '@/types/mdx';

import { PostsData } from './types';

/**
 * 게시물 배열을 날짜 기준 최신순으로 정렬합니다.
 */
export function sortPostsByDate(posts: Array<PostMetadata>): Array<PostMetadata> {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * 카테고리별로 구조화된 posts 데이터를 평탄화합니다.
 */
export function flattenPostsData(data: PostsData): Array<PostMetadata> {
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
  posts: Array<PostMetadata>;
  filters: FilterState;
}): Array<PostMetadata> => {
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

type PaginatePostsParams = {
  posts: Array<PostMetadata>;
  page: number;
  perPage: number;
};

/**
 * 게시물을 페이지네이션합니다.
 * @param posts 게시물 배열
 * @param page 페이지 번호
 * @param perPage 페이지당 게시물 수
 * @returns 페이지네이션된 게시물 배열
 */
export const paginatePosts = ({
  posts,
  page,
  perPage
}: PaginatePostsParams): Pagination<PostMetadata> => {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const results = posts.slice(start, end);
  const nextPage = end < posts.length ? page + 1 : null;
  const prevPage = start > 0 ? page - 1 : null;

  return {
    results,
    page,
    perPage,
    nextPage,
    prevPage,
    total: posts.length
  };
};
