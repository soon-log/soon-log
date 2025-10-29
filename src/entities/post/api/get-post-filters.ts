import { PostFilterState } from '../model/types';

import { getSortedPosts } from './get-sorted-posts';

export async function getPostFilters(filterState: PostFilterState) {
  const sortedPosts = await getSortedPosts(filterState);

  const categories = new Set<string>();
  const tags = new Set<string>();

  for (const post of sortedPosts) {
    if (post.category) {
      categories.add(post.category);
    }
    post.tags?.forEach((tag) => tags.add(tag));
  }

  return {
    categories: [...categories].sort(),
    tags: [...tags].sort()
  };
}
