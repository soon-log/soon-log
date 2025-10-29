import { PostFilterState } from '../model/types';

/**
 * URL 검색 파라미터를 PostFilterState 형식으로 변환합니다.
 * @param searchParams URLSearchParams
 * @returns PostFilterState 형식의 객체
 */
export function parsePostsQueryParams(searchParams: URLSearchParams): PostFilterState {
  const tags = searchParams.get('tags')?.split(',') || [];
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  const decodedTags = tags.map((tag) => decodeURIComponent(tag));
  const decodedCategory = typeof category === 'string' ? decodeURIComponent(category) : null;
  const decodedSearch = typeof search === 'string' ? decodeURIComponent(search) : null;

  return {
    tags: decodedTags,
    category: decodedCategory,
    search: decodedSearch
  };
}

/**
 * URL 페이지 파라미터를 파싱합니다.
 * @param searchParams URLSearchParams
 * @returns page와 perPage 파라미터를 파싱한 객체
 */
export function parsePageQueryParams(searchParams: URLSearchParams): {
  page: number;
  perPage: number;
} {
  const pageParam = searchParams.get('page');
  const perPageParam = searchParams.get('perPage');
  const page = pageParam ? parseInt(pageParam) : 1;
  const perPage = perPageParam ? parseInt(perPageParam) : 10;

  return {
    page,
    perPage
  };
}

/**
 * 게시물 필터링 조건을 URLSearchParams로 변환합니다.
 * @param filterState 게시물 필터링 조건
 * @returns URLSearchParams
 */
export function buildPostsQueryString(filterState: PostFilterState): URLSearchParams {
  const params = new URLSearchParams();
  const { tags, category, search } = filterState;

  if (tags && tags.length > 0) params.set('tags', tags.join(','));
  if (category) params.set('category', category);
  if (search) params.set('search', search);

  return params;
}
