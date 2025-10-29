import { buildAbsoluteUrl } from '@/shared/utils';

import { buildPostsQueryString } from '../lib/url';
import { Pagination, PostFilterState, PostMetadata } from '../model/types';

type GetPaginatedPostsParams = {
  pageParam: number | undefined;
  perPage: number;
  filterState: PostFilterState;
};

export async function getPaginatedPosts(
  args: GetPaginatedPostsParams
): Promise<Pagination<PostMetadata>> {
  const { pageParam, perPage, filterState } = args;

  const params = buildPostsQueryString(filterState);
  params.set('page', String(pageParam ?? 1));
  params.set('perPage', String(perPage));

  const res = await fetch(buildAbsoluteUrl(`/api/posts?${params.toString()}`));

  if (!res.ok) {
    throw new Error('[getPaginatedPosts] 요청에 실패했습니다.');
  }

  return await res.json();
}
