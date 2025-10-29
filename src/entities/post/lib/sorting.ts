import { PostMetadata } from '../model/types';

/**
 * 게시물 배열을 날짜 기준 최신순으로 정렬합니다.
 */
export function sortPostsByDateDesc(posts: Array<PostMetadata>): Array<PostMetadata> {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
