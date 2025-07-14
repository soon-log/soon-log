import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { PostMetadata } from '@/types/mdx';

import { TagCloud } from './tag-cloud';

describe('TagCloud 컴포넌트', () => {
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
      tags: ['TypeScript', 'JavaScript', 'React'],
      category: 'frontend',
      summary: 'TypeScript 기초입니다.',
      thumbnail: null
    }
  ];

  const mockOnTagClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('모든 태그가 올바르게 렌더링된다', () => {
    // Given & When
    render(<TagCloud allPosts={mockPosts} selectedTags={[]} onTagClick={mockOnTagClick} />);

    // Then
    expect(screen.getByText(/JavaScript/)).toBeInTheDocument();
    expect(screen.getByText(/React/)).toBeInTheDocument();
    expect(screen.getByText(/Node\.js/)).toBeInTheDocument();
    expect(screen.getByText(/TypeScript/)).toBeInTheDocument();
  });

  test('태그별 게시물 개수가 정확히 표시된다', () => {
    // Given & When
    render(<TagCloud allPosts={mockPosts} selectedTags={[]} onTagClick={mockOnTagClick} />);

    // Then - JavaScript는 3개 게시물, React는 2개, 나머지는 1개씩
    expect(screen.getByText('JavaScript (3)')).toBeInTheDocument();
    expect(screen.getByText('React (2)')).toBeInTheDocument();
    expect(screen.getByText('Node.js (1)')).toBeInTheDocument();
    expect(screen.getByText('TypeScript (1)')).toBeInTheDocument();
  });

  test('태그 클릭 시 onTagClick 콜백이 호출된다', async () => {
    // Given
    render(<TagCloud allPosts={mockPosts} selectedTags={[]} onTagClick={mockOnTagClick} />);

    // When
    await userEvent.click(screen.getByText('React (2)'));

    // Then
    expect(mockOnTagClick).toHaveBeenCalledWith('React');
  });

  test('선택된 태그가 시각적으로 강조된다', () => {
    // Given
    const selectedTags = ['React', 'JavaScript'];

    // When
    render(
      <TagCloud allPosts={mockPosts} selectedTags={selectedTags} onTagClick={mockOnTagClick} />
    );

    // Then
    const reactButton = screen.getByText('React (2)');
    const jsButton = screen.getByText('JavaScript (3)');
    const nodeButton = screen.getByText('Node.js (1)');

    expect(reactButton).toHaveAttribute('aria-pressed', 'true');
    expect(jsButton).toHaveAttribute('aria-pressed', 'true');
    expect(nodeButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('태그가 없는 게시물은 TagCloud에 영향을 주지 않는다', () => {
    // Given
    const postsWithoutTags: PostMetadata[] = [
      {
        key: 'post-no-tags',
        title: '태그 없는 게시물',
        date: '2024-01-04',
        tags: [],
        category: 'misc',
        summary: '태그가 없는 게시물입니다.',
        thumbnail: null
      },
      ...mockPosts
    ];

    // When
    render(<TagCloud allPosts={postsWithoutTags} selectedTags={[]} onTagClick={mockOnTagClick} />);

    // Then - 태그 개수는 동일해야 함
    expect(screen.getByText('JavaScript (3)')).toBeInTheDocument();
    expect(screen.getByText('React (2)')).toBeInTheDocument();
  });

  test('게시물이 없는 경우 적절한 메시지를 표시한다', () => {
    // Given & When
    render(<TagCloud allPosts={[]} selectedTags={[]} onTagClick={mockOnTagClick} />);

    // Then
    expect(screen.getByText('사용 가능한 태그가 없습니다.')).toBeInTheDocument();
  });

  test('태그가 없는 게시물만 있는 경우 적절한 메시지를 표시한다', () => {
    // Given
    const postsWithoutTags: PostMetadata[] = [
      {
        key: 'post-1',
        title: '태그 없는 게시물 1',
        date: '2024-01-01',
        tags: [],
        category: 'misc',
        summary: '태그가 없습니다.',
        thumbnail: null
      },
      {
        key: 'post-2',
        title: '태그 없는 게시물 2',
        date: '2024-01-02',
        tags: undefined,
        category: 'misc',
        summary: '태그가 없습니다.',
        thumbnail: null
      }
    ];

    // When
    render(<TagCloud allPosts={postsWithoutTags} selectedTags={[]} onTagClick={mockOnTagClick} />);

    // Then
    expect(screen.getByText('사용 가능한 태그가 없습니다.')).toBeInTheDocument();
  });

  test('태그가 사용 빈도 순으로 정렬된다', () => {
    // Given & When
    render(<TagCloud allPosts={mockPosts} selectedTags={[]} onTagClick={mockOnTagClick} />);

    // Then - 버튼들의 순서를 확인 (빈도 높은 순)
    const buttons = screen.getAllByRole('button');
    const buttonTexts = buttons.map((button) => button.textContent);

    expect(buttonTexts).toEqual([
      'JavaScript (3)', // 가장 많이 사용됨
      'React (2)', // 두 번째로 많이 사용됨
      'Node.js (1)', // 알파벳 순으로 N이 T보다 앞
      'TypeScript (1)' // 가장 적게 사용됨
    ]);
  });

  test('접근성 속성이 올바르게 설정된다', () => {
    // Given & When
    render(<TagCloud allPosts={mockPosts} selectedTags={['React']} onTagClick={mockOnTagClick} />);

    // Then
    const reactButton = screen.getByText('React (2)');
    const jsButton = screen.getByText('JavaScript (3)');

    expect(reactButton).toHaveAttribute('role', 'button');
    expect(reactButton).toHaveAttribute('aria-pressed', 'true');
    expect(jsButton).toHaveAttribute('aria-pressed', 'false');

    // 키보드 접근성
    expect(reactButton).toHaveAttribute('tabindex', '0');
  });
});
