import { FilterState, PostMetadata } from '@/app/(blog)/_types/mdx';

import { PostsData } from './types';
import { flattenPostsData, sortPostsByDate, filterPosts } from './utils';

/**
 * posts.json 데이터를 가져옵니다.
 */
export async function fetchPostsData(): Promise<PostsData> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || 'localhost:3000'}/posts/posts.json`
  );

  if (!res.ok) {
    throw new Error('posts.json 응답 실패');
  }

  return await res.json();
}

/**
 * 게시물을 가져와서 필터링하고 정렬하여 반환합니다.
 */
export async function getProcessedPosts(filters: FilterState): Promise<Array<PostMetadata>> {
  const posts = await fetchPostsData();
  const flattenedPosts = flattenPostsData(posts);
  const filteredPosts = filterPosts({ posts: flattenedPosts, filters });
  const sortedPosts = sortPostsByDate(filteredPosts);

  return sortedPosts;
}
