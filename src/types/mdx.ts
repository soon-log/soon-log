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

// 검색 인덱스 관련 타입 추가
export interface SearchablePost {
  key: string;
  title: string;
  content: string;
  summary?: string;
  tags?: string[];
  category?: string;
  date: string;
}

export interface SearchIndexData {
  index: any; // Lunr.js 인덱스 객체
  store: Record<string, SearchablePost>; // 게시물 데이터 저장소
}

export interface SearchResult {
  key: string;
  title: string;
  summary?: string;
  category?: string;
  tags?: string[];
  score: number; // 검색 점수
  highlights?: string[]; // 하이라이트된 텍스트 스니펫
}
