import { FilterState } from '@/types/mdx';

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
