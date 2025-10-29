import { filterPosts } from '../lib/filter';
import { sortPostsByDateDesc } from '../lib/sorting';
import { PostFilterState } from '../model/types';

import { getPostsJson } from './get-posts-json';

export async function getPostFilters(filterState: PostFilterState) {
  const posts = await getPostsJson();

  const flattend = Object.values(posts).flat();
  const filtered = filterPosts({ posts: flattend, filterState });
  const sorted = sortPostsByDateDesc(filtered);

  const categories = new Set<string>();
  const tags = new Set<string>();

  for (const post of sorted) {
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
