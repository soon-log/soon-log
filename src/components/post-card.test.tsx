import { render, screen } from '@testing-library/react';

import { PostMetadata } from '@/types/mdx';

import { PostCard } from './post-card';

const createMockPost = (overrides: Partial<PostMetadata> = {}): PostMetadata => ({
  key: 'test-post',
  title: '테스트 게시물 제목',
  date: '2025-01-27',
  tags: ['React', 'TypeScript'],
  category: 'tech',
  summary: '이것은 테스트용 게시물 요약입니다.',
  thumbnail: '/posts/test/thumbnail.jpg',
  ...overrides
});

describe('PostCard', () => {
  test('사용자가 게시물 정보를 확인할 수 있다', () => {
    // Given
    const mockPost = createMockPost();
    render(<PostCard post={mockPost} />);

    // When & Then
    expect(screen.getByText('테스트 게시물 제목')).toBeInTheDocument();
    expect(screen.getByText('2025년 1월 27일')).toBeInTheDocument();
    expect(screen.getByText('이것은 테스트용 게시물 요약입니다.')).toBeInTheDocument();
    expect(screen.getByText('tech')).toBeInTheDocument();
  });

  test('사용자가 게시물의 태그들을 확인할 수 있다', () => {
    // Given: 2개의 태그가 있는 게시물이 화면에 표시된 상태
    const mockPost = createMockPost({
      tags: ['React', 'TypeScript']
    });
    render(<PostCard post={mockPost} />);

    // When: 사용자가 태그를 확인할 때
    // Then: 모든 태그를 확인할 수 있어야 한다
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  test('사용자가 썸네일이 있는 게시물을 시각적으로 인식할 수 있다', () => {
    // Given
    const mockPost = createMockPost({
      thumbnail: '/posts/test/thumbnail.jpg'
    });
    render(<PostCard post={mockPost} />);

    // When & Then
    const thumbnailImage = screen.getByRole('img', { name: /테스트 게시물 제목/ });
    expect(thumbnailImage).toBeInTheDocument();
    expect(thumbnailImage).toHaveAttribute('alt', '테스트 게시물 제목 썸네일 이미지');
  });

  test('사용자가 게시물 카드 클릭으로 상세 페이지로 이동할 수 있다', () => {
    // Given
    const mockPost = createMockPost();
    render(<PostCard post={mockPost} />);

    // When & Then
    const postLink = screen.getByRole('link');
    expect(postLink).toHaveAttribute('href', '/post/test-post');
  });

  test('사용자가 태그가 없는 게시물도 정상적으로 볼 수 있다', () => {
    // Given
    const mockPost = createMockPost({
      tags: undefined
    });
    render(<PostCard post={mockPost} />);

    // When & Then
    expect(screen.getByText('테스트 게시물 제목')).toBeInTheDocument();
    expect(screen.getByText('2025년 1월 27일')).toBeInTheDocument();
    expect(screen.getByText('이것은 테스트용 게시물 요약입니다.')).toBeInTheDocument();
    expect(screen.queryByTestId('post-tags')).not.toBeInTheDocument();
  });

  test('사용자가 빈 태그 목록이 있는 게시물도 정상적으로 볼 수 있다', () => {
    // Given
    const mockPost = createMockPost({
      tags: []
    });
    render(<PostCard post={mockPost} />);

    // When & Then
    expect(screen.getByText('테스트 게시물 제목')).toBeInTheDocument();
    expect(screen.getByText('이것은 테스트용 게시물 요약입니다.')).toBeInTheDocument();
    expect(screen.queryByTestId('post-tags')).not.toBeInTheDocument();
  });

  test('사용자가 카테고리가 없는 게시물도 정상적으로 볼 수 있다', () => {
    // Given
    const mockPost = createMockPost({
      category: undefined
    });
    render(<PostCard post={mockPost} />);

    // When & Then
    expect(screen.getByText('테스트 게시물 제목')).toBeInTheDocument();
    expect(screen.getByText('이것은 테스트용 게시물 요약입니다.')).toBeInTheDocument();
    expect(screen.queryByTestId('post-category')).not.toBeInTheDocument();
  });

  test('사용자가 요약이 없는 게시물도 정상적으로 볼 수 있다', () => {
    // Given
    const mockPost = createMockPost({
      summary: undefined
    });
    render(<PostCard post={mockPost} />);

    // When & Then
    expect(screen.getByText('테스트 게시물 제목')).toBeInTheDocument();
    expect(screen.getByText('2025년 1월 27일')).toBeInTheDocument();
    expect(screen.queryByTestId('post-summary')).not.toBeInTheDocument();
  });

  test('사용자가 날짜를 이해하기 쉬운 형식으로 확인할 수 있다', () => {
    // Given
    const mockPost = createMockPost({
      date: '2025-12-25'
    });
    render(<PostCard post={mockPost} />);

    // When & Then
    expect(screen.getByText('2025년 12월 25일')).toBeInTheDocument();
  });

  test('사용자가 긴 제목의 게시물도 내용을 파악할 수 있다', () => {
    // Given
    const longTitle =
      '이것은 매우 긴 제목으로 PostCard에서 어떻게 표시되는지 확인하기 위한 테스트용 제목입니다';
    const mockPost = createMockPost({
      title: longTitle
    });
    render(<PostCard post={mockPost} />);

    // When & Then
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  test('사용자가 썸네일이 없는 게시물도 정상적으로 확인할 수 있다', () => {
    // Given
    const mockPost = createMockPost({
      thumbnail: null
    });
    render(<PostCard post={mockPost} />);

    // When & Then
    expect(screen.getByText('테스트 게시물 제목')).toBeInTheDocument();
    expect(screen.getByText('이것은 테스트용 게시물 요약입니다.')).toBeInTheDocument();
    // 썸네일이 없어도 다른 콘텐츠에 접근 가능한지 확인
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  test('사용자가 태그가 2개 이하일 때 모든 태그를 확인할 수 있다', () => {
    // Given
    const mockPost = createMockPost({
      tags: ['React', 'TypeScript']
    });
    render(<PostCard post={mockPost} />);

    // When & Then
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.queryByText(/\+\d+개/)).not.toBeInTheDocument();
  });

  test('사용자가 태그가 3개 이상일 때 처음 2개와 추가 카운터를 확인할 수 있다', () => {
    // Given
    const mockPost = createMockPost({
      tags: ['React', 'TypeScript', 'Next.js', 'TailwindCSS', 'Jest']
    });
    render(<PostCard post={mockPost} />);

    // When & Then
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('+3개')).toBeInTheDocument();
    // 나머지 태그들은 표시되지 않아야 한다
    expect(screen.queryByText('Next.js')).not.toBeInTheDocument();
    expect(screen.queryByText('TailwindCSS')).not.toBeInTheDocument();
    expect(screen.queryByText('Jest')).not.toBeInTheDocument();
  });

  test('사용자가 태그가 정확히 3개일 때 처음 2개와 "+1개" 카운터를 확인할 수 있다', () => {
    // Given
    const mockPost = createMockPost({
      tags: ['React', 'TypeScript', 'Next.js']
    });
    render(<PostCard post={mockPost} />);

    // When & Then
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('+1개')).toBeInTheDocument();
    // 나머지 태그들은 표시되지 않아야 한다
    expect(screen.queryByText('Next.js')).not.toBeInTheDocument();
  });
});
