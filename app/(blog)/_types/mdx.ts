// 검색 인덱스 관련 타입 추가
export interface SearchablePost {
  key: string;
  title: string;
  content: string;
  summary?: string;
  tags?: Array<string>;
  category?: string;
  date: string;
}

export interface SearchIndexData {
  index: any; // Lunr.js 인덱스 객체
  store: Record<string, SearchablePost>; // 게시물 데이터 저장소
}
