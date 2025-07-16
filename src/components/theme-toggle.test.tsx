'use client';

import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { ThemeProvider } from './theme-provider';
import { ThemeToggle } from './theme-toggle';

describe('ThemeToggle 컴포넌트', () => {
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

    // document.documentElement 모킹
    document.documentElement.classList.add = jest.fn();
    document.documentElement.classList.remove = jest.fn();
    document.documentElement.classList.toggle = jest.fn();
    document.documentElement.classList.contains = jest.fn();
    document.documentElement.setAttribute = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('버튼이 정상적으로 렌더링된다', async () => {
    // Given
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });
    (document.documentElement.classList.contains as jest.Mock).mockReturnValue(false);

    // When
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    // Then
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '테마 전환' })).toBeInTheDocument();
    });
  });

  test('system 테마에서 시스템이 다크 모드일 때 Sun 아이콘이 표시된다', async () => {
    // Given
    mockMatchMedia.mockReturnValue({
      matches: true, // 다크 모드 시스템 설정
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });
    (window.localStorage.getItem as jest.Mock).mockReturnValue('system');
    (document.documentElement.classList.contains as jest.Mock).mockReturnValue(true);

    // When
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    // Then - 컴포넌트가 마운트되고 테마가 적용된 후 Sun 아이콘이 표시되어야 함
    await waitFor(() => {
      const sunIcon = screen.getByTestId('sun-icon');
      expect(sunIcon).toBeInTheDocument();
    });
  });

  test('system 테마에서 시스템이 라이트 모드일 때 Moon 아이콘이 표시된다', async () => {
    // Given
    mockMatchMedia.mockReturnValue({
      matches: false, // 라이트 모드 시스템 설정
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });
    (window.localStorage.getItem as jest.Mock).mockReturnValue('system');
    (document.documentElement.classList.contains as jest.Mock).mockReturnValue(false);

    // When
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    // Then
    await waitFor(() => {
      const moonIcon = screen.getByTestId('moon-icon');
      expect(moonIcon).toBeInTheDocument();
    });
  });

  test('light 테마일 때 Moon 아이콘이 표시된다', async () => {
    // Given
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });
    (window.localStorage.getItem as jest.Mock).mockReturnValue('light');
    (document.documentElement.classList.contains as jest.Mock).mockReturnValue(false);

    // When
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    // Then
    await waitFor(() => {
      const moonIcon = screen.getByTestId('moon-icon');
      expect(moonIcon).toBeInTheDocument();
    });
  });

  test('dark 테마일 때 Sun 아이콘이 표시된다', async () => {
    // Given
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });
    (window.localStorage.getItem as jest.Mock).mockReturnValue('dark');
    (document.documentElement.classList.contains as jest.Mock).mockReturnValue(true);

    // When
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    // Then
    await waitFor(() => {
      const sunIcon = screen.getByTestId('sun-icon');
      expect(sunIcon).toBeInTheDocument();
    });
  });

  test('light 테마에서 클릭 시 dark 테마로 전환된다', async () => {
    // Given
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });
    (window.localStorage.getItem as jest.Mock).mockReturnValue('light');
    (document.documentElement.classList.contains as jest.Mock).mockReturnValue(false);

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    // When
    await waitFor(() => {
      const button = screen.getByRole('button', { name: '테마 전환' });
      return userEvent.click(button);
    });

    // Then
    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
  });

  test('dark 테마에서 클릭 시 light 테마로 전환된다', async () => {
    // Given
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });
    (window.localStorage.getItem as jest.Mock).mockReturnValue('dark');
    (document.documentElement.classList.contains as jest.Mock).mockReturnValue(true);

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    // When
    await waitFor(() => {
      const button = screen.getByRole('button', { name: '테마 전환' });
      return userEvent.click(button);
    });

    // Then
    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });
  });

  test('system 테마(시스템이 light)에서 클릭 시 dark 테마로 전환된다', async () => {
    // Given
    mockMatchMedia.mockReturnValue({
      matches: false, // 시스템이 light
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });
    (window.localStorage.getItem as jest.Mock).mockReturnValue('system');
    (document.documentElement.classList.contains as jest.Mock).mockReturnValue(false);

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    // When
    await waitFor(() => {
      const button = screen.getByRole('button', { name: '테마 전환' });
      return userEvent.click(button);
    });

    // Then
    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
  });

  test('system 테마(시스템이 dark)에서 클릭 시 light 테마로 전환된다', async () => {
    // Given
    mockMatchMedia.mockReturnValue({
      matches: true, // 시스템이 dark
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });
    (window.localStorage.getItem as jest.Mock).mockReturnValue('system');
    (document.documentElement.classList.contains as jest.Mock).mockReturnValue(true);

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    // When
    await waitFor(() => {
      const button = screen.getByRole('button', { name: '테마 전환' });
      return userEvent.click(button);
    });

    // Then
    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });
  });
});
