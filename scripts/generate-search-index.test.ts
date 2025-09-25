import { SearchablePost } from '@/app/(blog)/_types/mdx';

describe('검색 인덱스 생성 스크립트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('extractContentFromMDX', () => {
    test('MDX 파일에서 텍스트 콘텐츠를 추출한다', async () => {
      // Given
      const mdxContent = `# 제목

이것은 본문 내용입니다.

## 소제목

\`\`\`javascript
const code = 'test';
\`\`\`

더 많은 텍스트 내용입니다.`;

      // When
      const { extractContentFromMDX } = await import('./generate-search-index');
      const result = await extractContentFromMDX(mdxContent);

      // Then
      expect(result).toContain('제목');
      expect(result).toContain('이것은 본문 내용입니다');
      expect(result).toContain('소제목');
      expect(result).toContain('더 많은 텍스트 내용입니다');
      expect(result).not.toContain('```');
      expect(result).not.toContain('const code');
    });

    test('빈 MDX 파일에서는 빈 문자열을 반환한다', async () => {
      // Given
      const mdxContent = '';

      // When
      const { extractContentFromMDX } = await import('./generate-search-index');
      const result = await extractContentFromMDX(mdxContent);

      // Then
      expect(result).toBe('');
    });
  });

  describe('createSearchablePost', () => {
    test('메타데이터와 콘텐츠로 검색 가능한 게시물을 생성한다', async () => {
      // Given
      const metadata = {
        key: 'test-post',
        title: '테스트 게시물',
        date: '2025-01-01',
        tags: ['React', 'TypeScript'],
        category: 'frontend',
        summary: '테스트 요약'
      };
      const content = '이것은 테스트 콘텐츠입니다.';

      // When
      const { createSearchablePost } = await import('./generate-search-index');
      const result = await createSearchablePost(metadata, content);

      // Then
      expect(result).toEqual({
        key: 'test-post',
        title: '테스트 게시물',
        content: '이것은 테스트 콘텐츠입니다.',
        summary: '테스트 요약',
        tags: ['React', 'TypeScript'],
        category: 'frontend',
        date: '2025-01-01'
      });
    });
  });

  describe('generateSearchIndex', () => {
    test('검색 가능한 게시물들로부터 Lunr.js 인덱스를 생성한다', async () => {
      // Given
      const searchablePosts: SearchablePost[] = [
        {
          key: 'post-1',
          title: 'React 기초',
          content: 'React는 UI 라이브러리입니다.',
          summary: 'React 소개',
          tags: ['React'],
          category: 'frontend',
          date: '2025-01-01'
        },
        {
          key: 'post-2',
          title: 'TypeScript 가이드',
          content: 'TypeScript는 JavaScript의 슈퍼셋입니다.',
          summary: 'TypeScript 소개',
          tags: ['TypeScript'],
          category: 'frontend',
          date: '2025-01-02'
        }
      ];

      // When
      const { generateSearchIndex } = await import('./generate-search-index');
      const result = await generateSearchIndex(searchablePosts);

      // Then
      expect(result.index).toBeDefined();
      expect(result.store).toEqual({
        'post-1': searchablePosts[0],
        'post-2': searchablePosts[1]
      });
      expect(Object.keys(result.store)).toHaveLength(2);
    });

    test('빈 배열로는 빈 인덱스를 생성한다', async () => {
      // Given
      const searchablePosts: SearchablePost[] = [];

      // When
      const { generateSearchIndex } = await import('./generate-search-index');
      const result = await generateSearchIndex(searchablePosts);

      // Then
      expect(result.index).toBeDefined();
      expect(result.store).toEqual({});
    });
  });
});
