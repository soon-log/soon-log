import { Suspense } from 'react';

import { QUERY_KEY } from '@/entities/post';
import { getFilteredPosts } from '@/entities/post';
import { queryClient } from '@/shared/api';
import { FilterCollapsibleProvider, FilterBar } from '@/widgets/post-filter';
import { PostList } from '@/widgets/post-list/ui/post-list';

export function PostListPage() {
  queryClient.prefetchQuery({
    queryKey: QUERY_KEY.FILTERS,
    queryFn: getFilteredPosts
  });
  return (
    <div className="mx-3 space-y-6">
      <FilterCollapsibleProvider>
        <Suspense>
          <FilterBar />
        </Suspense>
      </FilterCollapsibleProvider>
      <PostList />
    </div>
  );
}
