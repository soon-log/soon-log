'use client';

import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { ThemeProvider } from '@/entities/theme';

import { ThemeToggleButton } from './theme-toggle-button';

describe('ThemeToggleButton 컴포넌트', () => {
  let mockMatchMedia: jest.Mock;

  beforeEach(() => {
    mockMatchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }));

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });
    Object.defineProperty(window, 'matchMedia', {
      value: mockMatchMedia,
      writable: true
    });

    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('시스템이 라이트모드이고 로컬스토리지에 테마가 없을 때 Moon 아이콘이 표시된다', async () => {
    // Given
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);

    // When
    render(
      <ThemeProvider>
        <ThemeToggleButton />
      </ThemeProvider>
    );

    // Then
    await waitFor(() => {
      const moonIcon = screen.getByTestId('moon-icon');
      expect(moonIcon).toBeInTheDocument();
    });
  });

  test('시스템이 다크모드이고 로컬스토리지에 테마가 없을 때 Sun 아이콘이 표시된다', async () => {
    // Given
    (window.matchMedia as jest.Mock).mockReturnValue({
      matches: true, // 다크모드 시스템 설정
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);

    // When
    render(
      <ThemeProvider>
        <ThemeToggleButton />
      </ThemeProvider>
    );

    // Then
    await waitFor(() => {
      const sunIcon = screen.getByTestId('sun-icon');
      expect(sunIcon).toBeInTheDocument();
    });
  });

  test('로컬 스토리지의 테마가 라이트 모드일 때 Moon 아이콘이 표시된다', async () => {
    // Given
    (window.localStorage.getItem as jest.Mock).mockReturnValue('light');

    // When
    render(
      <ThemeProvider>
        <ThemeToggleButton />
      </ThemeProvider>
    );

    // Then
    await waitFor(() => {
      const moonIcon = screen.getByTestId('moon-icon');
      expect(moonIcon).toBeInTheDocument();
    });
  });

  test('로컬 스토리지의 테마가 다크 모드일 때 Sun 아이콘이 표시된다', async () => {
    // Given
    (window.localStorage.getItem as jest.Mock).mockReturnValue('dark');

    // When
    render(
      <ThemeProvider>
        <ThemeToggleButton />
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
    (window.localStorage.getItem as jest.Mock).mockReturnValue('light');

    // When
    render(
      <ThemeProvider>
        <ThemeToggleButton />
      </ThemeProvider>
    );

    // Then
    await waitFor(() => {
      const moonIcon = screen.getByTestId('moon-icon');
      expect(moonIcon).toBeInTheDocument();
    });

    // When
    await waitFor(async () => {
      const button = screen.getByTestId('theme-toggle-button');
      await userEvent.click(button);
    });

    // Then
    await waitFor(() => {
      const sunIcon = screen.getByTestId('sun-icon');
      expect(sunIcon).toBeInTheDocument();
    });
  });

  test('dark 테마에서 클릭 시 light 테마로 전환된다', async () => {
    // Given
    (window.localStorage.getItem as jest.Mock).mockReturnValue('dark');

    // When
    render(
      <ThemeProvider>
        <ThemeToggleButton />
      </ThemeProvider>
    );

    // Then
    await waitFor(() => {
      const sunIcon = screen.getByTestId('sun-icon');
      expect(sunIcon).toBeInTheDocument();
    });

    // When
    await waitFor(async () => {
      const button = screen.getByTestId('theme-toggle-button');
      await userEvent.click(button);
    });

    // Then
    await waitFor(() => {
      const moonIcon = screen.getByTestId('moon-icon');
      expect(moonIcon).toBeInTheDocument();
    });
  });

  test('dark 테마에서 클릭 시 light 테마로 전환된다', async () => {
    // Given
    (window.localStorage.getItem as jest.Mock).mockReturnValue('dark');

    // When
    render(
      <ThemeProvider>
        <ThemeToggleButton />
      </ThemeProvider>
    );

    // Then
    await waitFor(() => {
      const sunIcon = screen.getByTestId('sun-icon');
      expect(sunIcon).toBeInTheDocument();
    });

    // When
    await waitFor(async () => {
      const button = screen.getByTestId('theme-toggle-button');
      await userEvent.click(button);
    });

    // Then
    await waitFor(() => {
      const moonIcon = screen.getByTestId('moon-icon');
      expect(moonIcon).toBeInTheDocument();
    });
  });

  test('로컬스토리지에 테마가 없고, 시스템이 라이트모드일 때 클릭시 dark 테마로 전환된다', async () => {
    // Given
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);

    // When
    render(
      <ThemeProvider>
        <ThemeToggleButton />
      </ThemeProvider>
    );

    // Then
    await waitFor(() => {
      const moonIcon = screen.getByTestId('moon-icon');
      expect(moonIcon).toBeInTheDocument();
    });

    // When
    await waitFor(async () => {
      const button = screen.getByTestId('theme-toggle-button');
      await userEvent.click(button);
    });

    // Then
    await waitFor(() => {
      const sunIcon = screen.getByTestId('sun-icon');
      expect(sunIcon).toBeInTheDocument();
    });
  });
});
