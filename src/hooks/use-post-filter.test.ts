import { renderHook } from '@testing-library/react';

import { PostMetadata } from '@/types/mdx';

import { usePostFilter } from './use-post-filter';

describe('usePostFilter 훅', () => {
  const mockPosts: PostMetadata[] = [
    {
      key: 'post-1',
      title: 'React 가이드',
      date: '2024-01-01',
      tags: ['React', 'JavaScript'],
      category: 'frontend',
      summary: 'React 가이드입니다.',
      thumbnail: null
    },
    {
      key: 'post-2',
      title: 'Node.js 튜토리얼',
      date: '2024-01-02',
      tags: ['Node.js', 'JavaScript'],
      category: 'backend',
      summary: 'Node.js 튜토리얼입니다.',
      thumbnail: null
    },
    {
      key: 'post-3',
      title: 'TypeScript 기초',
      date: '2024-01-03',
      tags: ['TypeScript', 'JavaScript'],
      category: 'frontend',
      summary: 'TypeScript 기초입니다.',
      thumbnail: null
    }
  ];

  test('모든 게시물이 초기에 표시된다', () => {
    // Given
    const filters = { category: undefined, tags: [] };

    // When
    const { result } = renderHook(() => usePostFilter(mockPosts, filters));

    // Then
    expect(result.current.filteredPosts).toHaveLength(3);
    expect(result.current.filteredPosts).toEqual(mockPosts);
  });

  test('카테고리 필터링이 정상 작동한다', () => {
    // Given
    const filters = { category: 'frontend', tags: [] };

    // When
    const { result } = renderHook(() => usePostFilter(mockPosts, filters));

    // Then
    expect(result.current.filteredPosts).toHaveLength(2);
    expect(
      result.current.filteredPosts.every((post: PostMetadata) => post.category === 'frontend')
    ).toBe(true);
  });

  test('태그 필터링이 정상 작동한다', () => {
    // Given
    const filters = { category: undefined, tags: ['React'] };

    // When
    const { result } = renderHook(() => usePostFilter(mockPosts, filters));

    // Then
    expect(result.current.filteredPosts).toHaveLength(1);
    expect(result.current.filteredPosts[0]?.key).toBe('post-1');
  });

  test('카테고리와 태그 조합 필터링이 정상 작동한다', () => {
    // Given
    const filters = { category: 'frontend', tags: ['JavaScript'] };

    // When
    const { result } = renderHook(() => usePostFilter(mockPosts, filters));

    // Then
    expect(result.current.filteredPosts).toHaveLength(2);
    expect(
      result.current.filteredPosts.every(
        (post: PostMetadata) => post.category === 'frontend' && post.tags?.includes('JavaScript')
      )
    ).toBe(true);
  });

  test('사용 가능한 카테고리 목록을 반환한다', () => {
    // Given
    const filters = { category: undefined, tags: [] };

    // When
    const { result } = renderHook(() => usePostFilter(mockPosts, filters));

    // Then
    expect(result.current.availableCategories).toEqual(['backend', 'frontend']);
  });

  test('사용 가능한 태그 목록을 반환한다', () => {
    // Given
    const filters = { category: undefined, tags: [] };

    // When
    const { result } = renderHook(() => usePostFilter(mockPosts, filters));

    // Then
    expect(result.current.availableTags).toEqual(['JavaScript', 'Node.js', 'React', 'TypeScript']);
  });

  test('매칭되는 게시물이 없는 경우 빈 배열을 반환한다', () => {
    // Given
    const filters = { category: 'design', tags: [] };

    // When
    const { result } = renderHook(() => usePostFilter(mockPosts, filters));

    // Then
    expect(result.current.filteredPosts).toHaveLength(0);
  });
});
