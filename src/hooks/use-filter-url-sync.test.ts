import { renderHook, act } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useFilterUrlSync } from './use-filter-url-sync';

// Next.js 모킹
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn()
}));

describe('useFilterUrlSync 훅', () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();
  const mockRouter = {
    push: mockPush,
    replace: mockReplace
  };

  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  test('초기 URL 파라미터에서 필터 상태를 읽어온다', () => {
    // Given - URL에 category와 tags 파라미터가 있는 경우
    const searchParamsWithFilters = new URLSearchParams('category=frontend&tags=React,JavaScript');
    (useSearchParams as jest.Mock).mockReturnValue(searchParamsWithFilters);

    // When
    const { result } = renderHook(() => useFilterUrlSync());

    // Then
    expect(result.current.filters).toEqual({
      category: 'frontend',
      tags: ['React', 'JavaScript']
    });
  });

  test('URL 파라미터가 없는 경우 기본 필터 상태를 반환한다', () => {
    // Given - 빈 URL 파라미터
    const emptySearchParams = new URLSearchParams();
    (useSearchParams as jest.Mock).mockReturnValue(emptySearchParams);

    // When
    const { result } = renderHook(() => useFilterUrlSync());

    // Then
    expect(result.current.filters).toEqual({
      category: undefined,
      tags: []
    });
  });

  test('필터 변경 시 URL이 업데이트된다', () => {
    // Given
    const { result } = renderHook(() => useFilterUrlSync());

    // When
    act(() => {
      result.current.updateFilters({ category: 'backend', tags: ['Node.js'] });
    });

    // Then
    expect(mockReplace).toHaveBeenCalledWith('?category=backend&tags=Node.js');
  });

  test('카테고리만 설정된 경우 URL에 카테고리만 포함된다', () => {
    // Given
    const { result } = renderHook(() => useFilterUrlSync());

    // When
    act(() => {
      result.current.updateFilters({ category: 'frontend', tags: [] });
    });

    // Then
    expect(mockReplace).toHaveBeenCalledWith('?category=frontend');
  });

  test('태그만 설정된 경우 URL에 태그만 포함된다', () => {
    // Given
    const { result } = renderHook(() => useFilterUrlSync());

    // When
    act(() => {
      result.current.updateFilters({ category: undefined, tags: ['React', 'TypeScript'] });
    });

    // Then
    expect(mockReplace).toHaveBeenCalledWith('?tags=React,TypeScript');
  });

  test('모든 필터가 비어있으면 빈 쿼리 스트링으로 업데이트된다', () => {
    // Given
    const { result } = renderHook(() => useFilterUrlSync());

    // When
    act(() => {
      result.current.updateFilters({ category: undefined, tags: [] });
    });

    // Then
    expect(mockReplace).toHaveBeenCalledWith('?');
  });

  test('잘못된 태그 문자열 파라미터를 안전하게 처리한다', () => {
    // Given - 빈 태그 파라미터
    const searchParamsWithEmptyTags = new URLSearchParams('tags=');
    (useSearchParams as jest.Mock).mockReturnValue(searchParamsWithEmptyTags);

    // When
    const { result } = renderHook(() => useFilterUrlSync());

    // Then
    expect(result.current.filters.tags).toEqual([]);
  });

  test('URL에서 특수 문자가 포함된 태그를 올바르게 디코딩한다', () => {
    // Given - URL 인코딩된 태그
    const searchParamsWithEncodedTags = new URLSearchParams('tags=Node.js,C%2B%2B');
    (useSearchParams as jest.Mock).mockReturnValue(searchParamsWithEncodedTags);

    // When
    const { result } = renderHook(() => useFilterUrlSync());

    // Then
    expect(result.current.filters.tags).toEqual(['Node.js', 'C++']);
  });
});
