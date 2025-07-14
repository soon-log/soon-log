import { promises as fs } from 'fs';
import path from 'path';

import { render, screen, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';

import HomePage from './page';

// fs 모듈을 mock
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn()
  }
}));

// path 모듈을 mock
jest.mock('path', () => ({
  join: jest.fn()
}));

// Next.js 모킹 (FilteredPostList에서 사용)
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

const mockPostsData = {
  etc: [
    {
      key: 'test1',
      title: '첫 번째 테스트 게시물',
      date: '2025-01-27',
      tags: ['React'],
      category: 'etc',
      summary: '첫 번째 게시물 요약'
    },
    {
      key: 'test2',
      title: '두 번째 테스트 게시물',
      date: '2025-01-26',
      tags: ['TypeScript'],
      category: 'etc',
      summary: '두 번째 게시물 요약'
    }
  ]
};

// 많은 게시물 데이터 생성
const generateManyPosts = (count: number) => {
  const posts = [];
  for (let i = 1; i <= count; i++) {
    posts.push({
      key: `test${i}`,
      title: `테스트 게시물 ${i}`,
      date: `2025-01-${String(i).padStart(2, '0')}`, // 날짜가 증가하도록 수정
      tags: [`tag${i}`],
      category: 'etc',
      summary: `게시물 ${i} 요약`
    });
  }
  return { etc: posts };
};

describe('홈페이지', () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();
  const mockRouter = {
    push: mockPush,
    replace: mockReplace
  };

  beforeEach(() => {
    (fs.readFile as jest.Mock).mockClear();
    (path.join as jest.Mock).mockClear();

    // Next.js mocks 설정
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
  });

  test('사용자가 모든 게시물 목록을 최신순으로 볼 수 있다', async () => {
    // Given
    (path.join as jest.Mock).mockReturnValue('/mocked/path/posts.json');
    (fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockPostsData));

    // When
    render(await HomePage());

    // Then
    const titles = screen.getAllByRole('heading', { level: 2 });
    expect(titles[0]).toHaveTextContent('첫 번째 테스트 게시물');
    expect(titles[1]).toHaveTextContent('두 번째 테스트 게시물');
  });

  test('사용자가 게시물이 없을 때 빈 목록을 확인할 수 있다', async () => {
    // Given
    (path.join as jest.Mock).mockReturnValue('/mocked/path/posts.json');
    (fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify({ etc: [] }));

    // When
    render(await HomePage());

    // Then
    expect(screen.getByText('Soon Log')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });

  test('사용자가 파일 읽기 실패 시 에러 메시지를 확인할 수 있다', async () => {
    // Given
    (path.join as jest.Mock).mockReturnValue('/mocked/path/posts.json');
    (fs.readFile as jest.Mock).mockRejectedValueOnce(new Error('File not found'));

    // When
    render(await HomePage());

    // Then
    expect(screen.getByText('게시물을 불러오는데 실패했습니다.')).toBeInTheDocument();
  });

  test('사용자가 무한 스크롤로 더 많은 게시물을 볼 수 있다', async () => {
    // Given
    const manyPostsData = generateManyPosts(25);
    (path.join as jest.Mock).mockReturnValue('/mocked/path/posts.json');
    (fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(manyPostsData));

    // When
    render(await HomePage());

    // Then
    await waitFor(() => {
      const titles = screen.getAllByRole('heading', { level: 2 });
      expect(titles).toHaveLength(10); // 초기 10개만 표시
    });

    // 무한 스크롤 트리거 요소가 있는지 확인
    expect(screen.getByTestId('load-more-trigger')).toBeInTheDocument();
  });
});
