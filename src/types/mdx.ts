export interface PostMetadata {
  key: string;
  title: string;
  date: string;
  tags?: string[];
  category?: string;
  summary?: string;
  thumbnail?: string | null;
}

// 필터링 관련 타입 추가
export interface FilterState {
  category?: string;
  tags: string[];
  search?: string;
}

export interface PostFilterHookResult {
  filteredPosts: PostMetadata[];
  availableCategories: string[];
  availableTags: string[];
}
