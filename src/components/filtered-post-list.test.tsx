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

describe('FilteredPostList', () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();
  const mockRouter = {
    push: mockPush,
    replace: mockReplace
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
    jest.clearAllMocks();
  });

  test('게시물 목록이 정상적으로 렌더링된다', () => {
    // When
    render(<FilteredPostList initialPosts={mockPosts} />);

    // Then
    expect(screen.getByText('첫 번째 게시물')).toBeInTheDocument();
    expect(screen.getByText('두 번째 게시물')).toBeInTheDocument();
    expect(screen.getByText('세 번째 게시물')).toBeInTheDocument();
  });

  test('필터 옵션 버튼이 렌더링되고 클릭 시 필터바가 토글된다', async () => {
    // When
    render(<FilteredPostList initialPosts={mockPosts} />);

    // Then
    const filterButton = screen.getByRole('button', { name: /필터 옵션/ });
    expect(filterButton).toBeInTheDocument();

    // 초기에는 필터바가 접혀있어야 함
    expect(screen.queryByLabelText('카테고리')).not.toBeInTheDocument();

    // 버튼 클릭 시 필터바가 펼쳐져야 함
    fireEvent.click(filterButton);

    await waitFor(() => {
      expect(screen.getByLabelText('카테고리')).toBeInTheDocument();
    });

    // 다시 클릭 시 필터바가 접혀야 함
    fireEvent.click(filterButton);

    await waitFor(() => {
      expect(screen.queryByLabelText('카테고리')).not.toBeInTheDocument();
    });
  });

  test('빈 게시물 목록일 때 적절한 메시지가 표시된다', () => {
    // When
    render(<FilteredPostList initialPosts={[]} />);

    // Then
    expect(screen.getByText('아직 작성된 게시물이 없습니다.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /필터 옵션/ })).toBeInTheDocument();
  });

  test('필터링된 결과가 없을 때 적절한 메시지가 표시된다', async () => {
    // Given - 존재하지 않는 검색어로 필터링
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams('search=존재하지않는게시물')
    );

    // When
    render(<FilteredPostList initialPosts={mockPosts} />);

    // Then
    await waitFor(() => {
      expect(screen.getByText('필터 조건에 맞는 게시물이 없습니다.')).toBeInTheDocument();
    });
  });

  test('무한 스크롤 트리거가 게시물이 많을 때 표시된다', () => {
    // Given - 15개의 게시물 생성 (POSTS_PER_PAGE = 10보다 많음)
    const manyPosts = Array.from({ length: 15 }, (_, i) => ({
      key: `post${i}`,
      title: `게시물 ${i}`,
      summary: `게시물 ${i} 요약`,
      date: `2024-01-${String(i + 1).padStart(2, '0')}`,
      category: 'frontend',
      tags: ['React']
    }));

    // When
    render(<FilteredPostList initialPosts={manyPosts} />);

    // Then
    expect(screen.getByTestId('load-more-trigger')).toBeInTheDocument();
    expect(screen.getByText('스크롤하여 더 많은 게시물 보기')).toBeInTheDocument();
  });

  test('필터바가 펼쳐졌을 때 카테고리와 태그 옵션이 표시된다', async () => {
    // When
    render(<FilteredPostList initialPosts={mockPosts} />);

    // 필터바 펼치기
    const filterButton = screen.getByRole('button', { name: /필터 옵션/ });
    fireEvent.click(filterButton);

    // Then
    await waitFor(() => {
      expect(screen.getByLabelText('카테고리')).toBeInTheDocument();
    });

    // 태그 버튼들이 있는지 확인 (더 구체적인 selector 사용)
    expect(screen.getByRole('button', { name: 'React' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'TypeScript' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Node.js' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Vue' })).toBeInTheDocument();
  });
});
