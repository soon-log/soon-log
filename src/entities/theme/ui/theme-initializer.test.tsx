'use client';

import { render } from '@testing-library/react';

import { ThemeInitializer } from './theme-initializer';

const renderAndExecuteScript = () => {
  const { baseElement } = render(<ThemeInitializer />);
  const script = baseElement.querySelector('script')?.innerHTML;
  if (script) {
    eval(script);
  }
};

describe('ThemeInitializer 컴포넌트', () => {
  let mockLocalStorage: Storage;
  let mockMatchMedia: jest.Mock;

  beforeEach(() => {
    // localStorage 모킹
    mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      length: 0,
      key: jest.fn()
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });

    mockMatchMedia = jest.fn();
    Object.defineProperty(window, 'matchMedia', {
      value: mockMatchMedia,
      writable: true
    });

    document.documentElement.setAttribute = jest.fn();
    document.documentElement.classList.add = jest.fn();
    document.documentElement.classList.remove = jest.fn();
    document.documentElement.getAttribute = jest.fn();

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('localStorage에 테마가 없고 시스템 선호도가 light일 때 light 테마가 적용된다', () => {
    // Given
    mockLocalStorage.getItem = jest.fn().mockReturnValue(null);
    mockMatchMedia.mockReturnValue({ matches: false });

    // When
    renderAndExecuteScript();

    // Then
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
    expect(document.documentElement.classList.remove).toHaveBeenCalledWith('dark');
  });

  test('localStorage에 테마가 없고 시스템 선호도가 dark일 때 dark 테마가 적용된다', () => {
    // Given
    mockLocalStorage.getItem = jest.fn().mockReturnValue(null);
    mockMatchMedia.mockReturnValue({ matches: true });

    // When
    renderAndExecuteScript();

    // Then
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
  });

  test('localStorage에 system 테마가 저장되어 있고 시스템 선호도가 light일 때 light 테마가 적용된다', () => {
    // Given
    mockLocalStorage.getItem = jest.fn().mockReturnValue('system');
    mockMatchMedia.mockReturnValue({ matches: false });

    // When
    renderAndExecuteScript();

    // Then
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
    expect(document.documentElement.classList.remove).toHaveBeenCalledWith('dark');
  });

  test('localStorage에 system 테마가 저장되어 있고 시스템 선호도가 dark일 때 dark 테마가 적용된다', () => {
    // Given
    mockLocalStorage.getItem = jest.fn().mockReturnValue('system');
    mockMatchMedia.mockReturnValue({ matches: true });

    // When
    renderAndExecuteScript();

    // Then
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
  });

  test('localStorage에 light 테마가 저장되어 있을 때 시스템 선호도와 관계없이 light 테마가 적용된다', () => {
    // Given
    mockLocalStorage.getItem = jest.fn().mockReturnValue('light');
    mockMatchMedia.mockReturnValue({ matches: true });

    // When
    renderAndExecuteScript();

    // Then
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
    expect(document.documentElement.classList.remove).toHaveBeenCalledWith('dark');
  });

  test('localStorage에 dark 테마가 저장되어 있을 때 시스템 선호도와 관계없이 dark 테마가 적용된다', () => {
    // Given
    mockLocalStorage.getItem = jest.fn().mockReturnValue('dark');
    mockMatchMedia.mockReturnValue({ matches: false });

    // When
    renderAndExecuteScript();

    // Then
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
  });

  test('에러 발생 시 기본 light 테마가 적용되고 에러가 로깅된다', () => {
    // Given
    mockLocalStorage.getItem = jest.fn().mockImplementation(() => {
      throw new Error('localStorage 오류');
    });

    // When
    renderAndExecuteScript();

    // Then
    expect(console.error).toHaveBeenCalledWith('[오류] 테마 초기화 오류:', expect.any(Error));
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
    expect(document.documentElement.classList.remove).toHaveBeenCalledWith('dark');
  });
});
