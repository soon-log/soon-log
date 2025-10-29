import { PostFilterState, PostMetadata } from '../model/types';

/**
 * 필터 조건에 맞는 게시물을 추출합니다.
 * @param posts 게시물 배열
 * @param filterState 필터 조건
 * @returns 필터 조건에 맞는 게시물 배열
 */
export const filterPosts = ({
  posts,
  filterState
}: {
  posts: Array<PostMetadata>;
  filterState: PostFilterState;
}): Array<PostMetadata> => {
  return posts.filter((post) => {
    if (filterState.category && post.category !== filterState.category) {
      return false;
    }

    if (filterState.tags.length > 0) {
      const hasAllTags = filterState.tags.every((tag) => post.tags?.includes(tag));
      if (!hasAllTags) return false;
    }

    if (filterState.search && filterState.search.trim() !== '') {
      const searchTerm = filterState.search.toLowerCase();
      const titleMatch = post.title.toLowerCase().includes(searchTerm);
      const summaryMatch = post.summary?.toLowerCase().includes(searchTerm);

      if (!(titleMatch || summaryMatch)) {
        return false;
      }
    }

    return true;
  });
};
