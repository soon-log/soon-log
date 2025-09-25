import { FilterState } from '@/app/(blog)/_types/mdx';

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
 * 게시물 필터링 조건을 URLSearchParams로 변환합니다.
 * @param filters 게시물 필터링 조건
 * @returns URLSearchParams
 */
export function buildPostsQueryString(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();
  const { tags, category, search } = filters;

  if (tags && tags.length > 0) params.set('tags', tags.join(','));
  if (category) params.set('category', category);
  if (search) params.set('search', search);

  return params;
}
