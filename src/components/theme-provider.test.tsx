'use client';

import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { ThemeProvider, useTheme } from './theme-provider';

// 테스트용 컴포넌트
function TestComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  );
}

describe('ThemeProvider 컴포넌트', () => {
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('초기 로드 시 시스템 선호도가 light일 때 light 테마가 적용된다', async () => {
    // Given
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);

    // When
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Then
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
    });
    expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', false);
  });

  test('초기 로드 시 시스템 선호도가 dark일 때 dark 테마가 적용된다', async () => {
    // Given
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);

    // When
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Then
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
    });
    expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
  });

  test('localStorage에 저장된 테마가 있을 때 해당 테마가 적용된다', async () => {
    // Given
    (window.localStorage.getItem as jest.Mock).mockReturnValue('dark');
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });

    // When
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Then
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });
    expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
  });

  test('테마 변경 시 localStorage에 저장되고 DOM에 반영된다', async () => {
    // Given
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // When
    await userEvent.click(screen.getByText('Dark'));

    // Then
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });
    expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
  });

  test('light 테마 선택 시 DOM에서 dark 클래스가 제거된다', async () => {
    // Given
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // When
    await userEvent.click(screen.getByText('Light'));

    // Then
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    });
    expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', false);
  });

  test('시스템 테마 선택 시 미디어 쿼리에 따라 테마가 적용된다', async () => {
    // Given
    mockMatchMedia.mockReturnValue({
      matches: true, // 시스템이 dark 모드
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // When
    await userEvent.click(screen.getByText('System'));

    // Then
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
    });
    expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
  });
});
