import { PostFilterState } from '@/entities/post/model/types';

export const QUERY_KEY = {
  FILTERS: ['filters'],
  POSTS: (filters: PostFilterState & { perPage?: number }) => ['posts', filters],
  SEARCH_INDEX: ['search-index']
};
