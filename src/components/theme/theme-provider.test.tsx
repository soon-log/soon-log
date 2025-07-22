'use client';

import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { ThemeProvider, useTheme } from './theme-provider';

function TestComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
    </div>
  );
}

describe('ThemeProvider 컴포넌트', () => {
  let mockLocalStorage: Storage;
  let mockMatchMedia: jest.Mock;

  beforeEach(() => {
    mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      length: 0,
      key: jest.fn()
    };

    mockMatchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }));

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
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

  test('초기 로드 시 OS 화면모드가 라이트모드일 때 light 테마가 적용된다', async () => {
    // Given
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);

    // When
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    await waitFor(() => {
      expect(document.documentElement).not.toHaveClass('dark');
      expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    });

    expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
  });

  test('초기 로드 시 OS 화면모드가 다크모드일 때 dark 테마가 적용된다', async () => {
    // Given
    (window.matchMedia as jest.Mock).mockImplementation((query) => ({
      matches: true, // dark 모드
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }));
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);

    // When
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Then
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('dark');
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    });

    expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
  });

  test('localStorage에 저장된 테마가 다크모드일 때 다크 테마가 적용된다', async () => {
    // Given
    (window.localStorage.getItem as jest.Mock).mockReturnValue('dark');

    // When
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Then
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('dark');
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    });

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  test('테마 변경 시 localStorage에 저장되고 DOM에 반영된다', async () => {
    // Given
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);

    // when
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Then
    expect(screen.getByTestId('current-theme')).toHaveTextContent('system');

    // When
    await userEvent.click(screen.getByText('Dark'));

    // Then
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('dark');
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
  });

  test('light 테마 선택 시 DOM에서 dark 클래스가 제거된다', async () => {
    // Given
    (window.localStorage.getItem as jest.Mock).mockReturnValue('dark');

    // when
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Then
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');

    // When
    await userEvent.click(screen.getByText('Light'));

    // Then
    await waitFor(() => {
      expect(document.documentElement).not.toHaveClass('dark');
      expect(document.documentElement).toHaveAttribute('data-theme', 'light');
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });
  });

  test('컴포넌트가 언마운트되면 change 이벤트 리스너가 제거된다', () => {
    // Given
    const removeEventListener = jest.fn();
    (window.matchMedia as jest.Mock).mockImplementation(() => ({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener
    }));

    const { unmount } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // When
    unmount();

    // Then: removeEventListener가 호출되었는지 확인
    expect(removeEventListener).toHaveBeenCalled();
  });
});
