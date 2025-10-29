import { PostsData } from '../model/types';

export async function getPostsJson(): Promise<PostsData> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/posts/posts.json`
  );

  if (!res.ok) {
    throw new Error('posts.json 응답 실패');
  }

  return await res.json();
}
