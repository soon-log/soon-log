import { render, screen } from '@testing-library/react';

import { ThemeProvider } from '@/components/theme/theme-provider';

import Page from './page';

// Mock the dependencies
jest.mock('../components/filtered-post-list', () => ({
  FilteredPostList: () => <div data-testid="filtered-post-list">FilteredPostList</div>
}));

jest.mock('../components/search-bar', () => ({
  SearchBar: () => <div data-testid="search-bar">SearchBar</div>
}));

jest.mock('../hooks/use-post-filter', () => ({
  usePostFilter: () => ({
    filteredPosts: []
  })
}));

jest.mock('../hooks/use-search', () => ({
  useSearch: () => ({
    searchTerm: '',
    setSearchTerm: jest.fn(),
    searchResults: []
  })
}));

describe('Page', () => {
  const mockMatchMedia = jest.fn();

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      value: mockMatchMedia,
      writable: true
    });

    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('메인 페이지가 정상적으로 렌더링된다', async () => {
    const PageComponent = await Page();

    render(<ThemeProvider>{PageComponent}</ThemeProvider>);

    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('filtered-post-list')).toBeInTheDocument();
  });
});
