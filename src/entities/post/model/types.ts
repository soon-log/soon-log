export type Pagination<T> = {
  results: Array<T>;
  page: number;
  nextPage: number | null;
  prevPage: number | null;
  perPage: number;
  total: number;
};

export interface PostFilterState {
  category: string | null;
  tags: Array<string>;
  search: string | null;
}

export interface PostsData {
  [category: string]: Array<PostMetadata>;
}

export interface PostMetadata {
  key: string;
  title: string;
  date: string;
  tags?: Array<string>;
  category?: string;
  summary?: string;
  thumbnail?: string | null;
}

export interface SearchResult {
  key: string;
  title: string;
  summary?: string;
  category?: string;
  tags?: Array<string>;
  score: number; // 검색 점수
  highlights?: Array<string>; // 하이라이트된 텍스트 스니펫
}
