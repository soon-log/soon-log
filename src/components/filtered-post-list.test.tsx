import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';

import { FilteredPostList } from '@/components/filtered-post-list';
import { PostMetadata } from '@/types/mdx';

// Next.js 모킹
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn()
}));

// IntersectionObserver mock
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
  callback
}));

// 테스트용 게시물 데이터
const mockPosts: PostMetadata[] = [
  {
    key: 'post1',
    title: '첫 번째 게시물',
    summary: '첫 번째 게시물 요약',
    date: '2024-01-15',
    category: 'frontend',
    tags: ['React', 'TypeScript']
  },
  {
    key: 'post2',
    title: '두 번째 게시물',
    summary: '두 번째 게시물 요약',
    date: '2024-01-10',
    category: 'backend',
    tags: ['Node.js']
  },
  {
    key: 'post3',
    title: '세 번째 게시물',
    summary: '세 번째 게시물 요약',
    date: '2024-01-05',
    category: 'frontend',
    tags: ['Vue']
  }
];

// 빈 게시물 배열
const emptyPosts: PostMetadata[] = [];

// 많은 게시물 (무한 스크롤 테스트용)
const manyPosts = Array.from({ length: 25 }, (_, i) => ({
  key: `post${i + 1}`,
  title: `게시물 ${i + 1}`,
  summary: `게시물 ${i + 1} 요약`,
  date: `2024-01-${String(i + 1).padStart(2, '0')}`,
  category: i % 2 === 0 ? 'frontend' : 'backend',
  tags: ['React', 'TypeScript']
}));

describe('FilteredPostList', () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();
  const mockGet = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace
    });

    (useSearchParams as jest.Mock).mockReturnValue({
      get: mockGet,
      toString: () => ''
    });

    mockGet.mockReturnValue(null);

    // IntersectionObserver 초기화
    mockObserve.mockClear();
    mockUnobserve.mockClear();
    mockDisconnect.mockClear();
  });

  test('게시물 목록이 정상적으로 렌더링된다', () => {
    // When
    render(<FilteredPostList initialPosts={mockPosts} />);

    // Then
    expect(screen.getByText('첫 번째 게시물')).toBeInTheDocument();
    expect(screen.getByText('두 번째 게시물')).toBeInTheDocument();
    expect(screen.getByText('세 번째 게시물')).toBeInTheDocument();

    // 필터 옵션 버튼이 있는지 확인
    expect(screen.getByRole('button', { name: /필터 옵션/ })).toBeInTheDocument();
  });

  test('필터 옵션 버튼이 렌더링되고 클릭 시 필터바가 토글된다', async () => {
    // Given
    render(<FilteredPostList initialPosts={mockPosts} />);

    // When
    const filterButton = screen.getByRole('button', { name: /필터 옵션/ });

    // Then - 초기 상태에서는 필터바가 접혀있음
    expect(screen.queryByText('카테고리')).not.toBeInTheDocument();

    // When - 필터바 펼치기
    fireEvent.click(filterButton);

    // Then - 필터바가 펼쳐짐
    await waitFor(() => {
      expect(screen.getByText('카테고리')).toBeInTheDocument();
    });
  });

  test('빈 게시물 목록일 때 적절한 메시지가 표시된다', () => {
    // When
    render(<FilteredPostList initialPosts={emptyPosts} />);

    // Then
    expect(screen.getByText('아직 작성된 게시물이 없습니다.')).toBeInTheDocument();

    // 필터 옵션 버튼은 여전히 표시되어야 함
    expect(screen.getByRole('button', { name: /필터 옵션/ })).toBeInTheDocument();
  });

  test('필터링된 결과가 없을 때 적절한 메시지가 표시된다', () => {
    // Given - 특정 카테고리로 필터링된 상태를 모킹
    mockGet.mockImplementation((key: string) => {
      if (key === 'category') return 'nonexistent';
      return null;
    });

    // When
    render(<FilteredPostList initialPosts={mockPosts} />);

    // Then
    expect(screen.getByText('필터 조건에 맞는 게시물이 없습니다.')).toBeInTheDocument();

    // 필터 옵션 버튼은 여전히 표시되어야 함
    expect(screen.getByRole('button', { name: /필터 옵션/ })).toBeInTheDocument();
  });

  test('무한 스크롤 트리거가 게시물이 많을 때 표시된다', () => {
    // When
    render(<FilteredPostList initialPosts={manyPosts} />);

    // Then
    expect(screen.getByTestId('load-more-trigger')).toBeInTheDocument();
    expect(screen.getByText('스크롤하여 더 많은 게시물 보기')).toBeInTheDocument();
  });

  test('필터바가 펼쳐졌을 때 카테고리와 태그 옵션이 표시된다', async () => {
    // Given
    render(<FilteredPostList initialPosts={mockPosts} />);

    // When
    // 필터바 펼치기
    const filterButton = screen.getByRole('button', { name: /필터 옵션/ });
    fireEvent.click(filterButton);

    // Then
    await waitFor(() => {
      expect(screen.getByText('카테고리')).toBeInTheDocument();
    });

    // 태그 버튼들이 있는지 확인 (더 구체적인 selector 사용)
    expect(screen.getByRole('button', { name: 'React (1)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'TypeScript (1)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Node.js (1)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Vue (1)' })).toBeInTheDocument();
  });

  test('className prop이 루트 엘리먼트에 올바르게 적용된다', () => {
    // When
    render(<FilteredPostList initialPosts={mockPosts} className="custom-class bg-red-100" />);

    // Then
    const rootElement = screen.getByTestId('filtered-post-list');
    expect(rootElement).toHaveClass('space-y-6');
    expect(rootElement).toHaveClass('custom-class');
    expect(rootElement).toHaveClass('bg-red-100');
  });
});
