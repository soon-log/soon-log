import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { FilterState, PostMetadata } from '@/types/mdx';

import { FilterBar } from './filter-bar';

describe('FilterBar 컴포넌트', () => {
  const mockAvailableCategories = ['frontend', 'backend', 'design'];
  const mockAllPosts: PostMetadata[] = [
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
      tags: ['TypeScript', 'JavaScript', 'React'],
      category: 'frontend',
      summary: 'TypeScript 기초입니다.',
      thumbnail: null
    }
  ];
  const mockOnFiltersChange = jest.fn();

  const defaultProps = {
    filters: { category: undefined, tags: [] } as FilterState,
    availableCategories: mockAvailableCategories,
    allPosts: mockAllPosts,
    onFiltersChange: mockOnFiltersChange
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('필터바가 정상적으로 렌더링된다', () => {
    // Given & When
    render(<FilterBar {...defaultProps} />);

    // Then
    expect(screen.getByText('카테고리')).toBeInTheDocument();
    expect(screen.getByText('태그')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '필터 초기화' })).toBeInTheDocument();
  });

  test('TagCloud에서 태그를 선택할 수 있다', async () => {
    // Given
    render(<FilterBar {...defaultProps} />);

    // When - React 태그 선택
    const reactTag = screen.getByText('React (2)');
    await userEvent.click(reactTag);

    // Then
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      category: undefined,
      tags: ['React']
    });
  });

  test('여러 태그를 선택할 수 있다', async () => {
    // Given - React가 이미 선택된 상태
    const propsWithReactSelected = {
      ...defaultProps,
      filters: { category: undefined, tags: ['React'] }
    };
    render(<FilterBar {...propsWithReactSelected} />);

    // When - JavaScript 태그 추가 선택
    const jsTag = screen.getByText('JavaScript (3)');
    await userEvent.click(jsTag);

    // Then - React와 JavaScript 모두 선택된 상태
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      category: undefined,
      tags: ['React', 'JavaScript']
    });
  });

  test('이미 선택된 태그를 클릭하면 선택이 해제된다', async () => {
    // Given
    const propsWithSelectedTags = {
      ...defaultProps,
      filters: { category: undefined, tags: ['React', 'JavaScript'] }
    };
    render(<FilterBar {...propsWithSelectedTags} />);

    // When
    const reactTag = screen.getByText('React (2)');
    await userEvent.click(reactTag);

    // Then
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      category: undefined,
      tags: ['JavaScript']
    });
  });

  test('필터 초기화 버튼이 모든 필터를 초기화한다', async () => {
    // Given
    const propsWithFilters = {
      ...defaultProps,
      filters: { category: 'frontend', tags: ['React', 'JavaScript'] }
    };
    render(<FilterBar {...propsWithFilters} />);

    // When
    const resetButton = screen.getByRole('button', { name: '필터 초기화' });
    await userEvent.click(resetButton);

    // Then
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      category: undefined,
      tags: []
    });
  });

  test('선택된 태그가 TagCloud에서 활성 상태로 표시된다', () => {
    // Given
    const propsWithTags = {
      ...defaultProps,
      filters: { category: undefined, tags: ['React', 'JavaScript'] }
    };

    // When
    render(<FilterBar {...propsWithTags} />);

    // Then
    const reactTag = screen.getByText('React (2)');
    const jsTag = screen.getByText('JavaScript (3)');
    const tsTag = screen.getByText('TypeScript (1)');

    expect(reactTag).toHaveAttribute('aria-pressed', 'true');
    expect(jsTag).toHaveAttribute('aria-pressed', 'true');
    expect(tsTag).toHaveAttribute('aria-pressed', 'false');
  });

  test('활성 필터가 있을 때만 초기화 버튼이 활성화된다', () => {
    // Given - 필터가 없는 경우
    const { rerender } = render(<FilterBar {...defaultProps} />);

    // Then
    expect(screen.getByRole('button', { name: '필터 초기화' })).toBeDisabled();

    // Given - 필터가 있는 경우로 재렌더링
    const propsWithFilters = {
      ...defaultProps,
      filters: { category: 'frontend', tags: [] }
    };
    rerender(<FilterBar {...propsWithFilters} />);

    // Then
    expect(screen.getByRole('button', { name: '필터 초기화' })).toBeEnabled();
  });
});
