import { PostMetadata, Pagination } from '../model/types';

type PaginatePostsParams = {
  posts: Array<PostMetadata>;
  page: number;
  perPage: number;
};

/**
 * 게시물을 페이지네이션합니다.
 * @param posts 게시물 배열
 * @param page 페이지 번호
 * @param perPage 페이지당 게시물 수
 * @returns 페이지네이션된 게시물 배열
 */
export const paginatePosts = ({
  posts,
  page,
  perPage
}: PaginatePostsParams): Pagination<PostMetadata> => {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const results = posts.slice(start, end);
  const nextPage = end < posts.length ? page + 1 : null;
  const prevPage = start > 0 ? page - 1 : null;

  return {
    results,
    page,
    perPage,
    nextPage,
    prevPage,
    total: posts.length
  };
};
