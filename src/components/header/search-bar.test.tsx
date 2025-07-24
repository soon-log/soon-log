import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

// Next.js router 모킹
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

// useSearch 훅 모킹
const mockUseSearch = {
  query: '',
  setQuery: jest.fn(),
  results: [],
  isLoading: false,
  error: null
};

jest.mock('../hooks/use-search', () => ({
  useSearch: () => mockUseSearch
}));

// SearchBar 컴포넌트 임포트 (모킹 후에)
import { SearchBar } from './search-bar';

const mockSearchResults = [
  {
    key: 'react-hooks',
    title: 'React Hooks 완전 정복',
    summary: 'React Hooks의 모든 것을 알아봅니다',
    category: 'frontend',
    tags: ['React', 'Hooks'],
    score: 0.95,
    highlights: ['React Hooks']
  },
  {
    key: 'typescript-guide',
    title: 'TypeScript 실무 가이드',
    summary: 'TypeScript 실무에서 사용하는 방법',
    category: 'frontend',
    tags: ['TypeScript'],
    score: 0.85,
    highlights: ['TypeScript']
  }
];

describe('SearchBar 컴포넌트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // 기본 상태로 리셋
    Object.assign(mockUseSearch, {
      query: '',
      setQuery: jest.fn(),
      results: [],
      isLoading: false,
      error: null
    });
  });

  test('검색 입력 필드가 정상적으로 렌더링된다', () => {
    // Given & When
    render(<SearchBar />);

    // Then
    expect(screen.getByPlaceholderText('검색어를 입력하세요...')).toBeInTheDocument();
    expect(screen.getByLabelText('검색')).toBeInTheDocument();
  });

  test('검색어를 입력하면 setQuery가 호출된다', async () => {
    // Given
    const setQueryMock = jest.fn();
    Object.assign(mockUseSearch, {
      setQuery: setQueryMock
    });

    render(<SearchBar />);
    const searchInput = screen.getByPlaceholderText('검색어를 입력하세요...');

    // When
    await userEvent.type(searchInput, 'React');

    // Then
    expect(setQueryMock).toHaveBeenCalled();
  });

  test('검색 결과가 있을 때 드롭다운이 표시된다', () => {
    // Given
    Object.assign(mockUseSearch, {
      query: 'React',
      results: mockSearchResults
    });

    // When
    render(<SearchBar />);

    // Then
    expect(screen.getByRole('listbox', { name: '검색 결과' })).toBeInTheDocument();
    expect(screen.getByText('React Hooks 완전 정복')).toBeInTheDocument();
    expect(screen.getByText('TypeScript 실무 가이드')).toBeInTheDocument();
  });

  test('검색 결과가 없을 때 "결과 없음" 메시지가 표시된다', () => {
    // Given
    Object.assign(mockUseSearch, {
      query: '존재하지않는검색어',
      results: []
    });

    // When
    render(<SearchBar />);

    // Then
    expect(screen.getByText('검색 결과가 없습니다')).toBeInTheDocument();
  });

  test('로딩 중일 때 로딩 상태가 표시된다', () => {
    // Given
    Object.assign(mockUseSearch, {
      query: 'React',
      isLoading: true
    });

    // When
    render(<SearchBar />);

    // Then
    expect(screen.getByText('검색 중...')).toBeInTheDocument();
  });

  test('에러가 발생했을 때 에러 메시지가 표시된다', () => {
    // Given
    Object.assign(mockUseSearch, {
      query: 'React',
      error: '검색 인덱스 로드 실패'
    });

    // When
    render(<SearchBar />);

    // Then
    expect(screen.getByText('검색 인덱스 로드 실패')).toBeInTheDocument();
  });
});
