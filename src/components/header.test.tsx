'use client';

import { render, screen } from '@testing-library/react';

import { Header } from './header';
import { ThemeProvider } from './theme-provider';

// Next.js 모킹
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn()
  })),
  useSearchParams: jest.fn(() => new URLSearchParams())
}));

describe('Header 컴포넌트', () => {
  let mockMatchMedia: jest.Mock;

  beforeEach(() => {
    // localStorage 모킹
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });

    // matchMedia 모킹
    mockMatchMedia = jest.fn();
    Object.defineProperty(window, 'matchMedia', {
      value: mockMatchMedia,
      writable: true
    });

    // document.documentElement.classList 모킹
    document.documentElement.classList.add = jest.fn();
    document.documentElement.classList.remove = jest.fn();
    document.documentElement.classList.toggle = jest.fn();

    // fetch 모킹 (검색 인덱스 로드용)
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({})
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('헤더가 제목과 테마 토글 버튼을 포함하여 렌더링된다', () => {
    // Given
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });

    // When
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );

    // Then
    expect(screen.getByRole('heading', { level: 1, name: 'Soon Log' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '테마 전환' })).toBeInTheDocument();
  });

  test('제목과 테마 토글 버튼이 모두 존재한다', () => {
    // Given
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });

    // When
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );

    // Then
    expect(screen.getByRole('heading', { level: 1, name: 'Soon Log' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '테마 전환' })).toBeInTheDocument();
  });

  test('검색바가 정상적으로 렌더링된다', () => {
    // Given
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });

    // When
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );

    // Then
    expect(screen.getByRole('combobox', { name: '검색' })).toBeInTheDocument();
  });
});
