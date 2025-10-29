import { filterPosts } from '../lib/filter';
import { sortPostsByDateDesc } from '../lib/sorting';
import { PostFilterState, PostMetadata } from '../model/types';

import { getPostsJson } from './get-posts-json';

export async function getSortedPosts(filterState?: PostFilterState): Promise<Array<PostMetadata>> {
  const posts = await getPostsJson();

  const flattend = Object.values(posts).flat();
  const filtered = filterState ? filterPosts({ posts: flattend, filterState }) : flattend;
  return sortPostsByDateDesc(filtered);
}
