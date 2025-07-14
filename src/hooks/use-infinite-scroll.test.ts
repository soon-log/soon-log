import { renderHook, act } from '@testing-library/react';

import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';

// IntersectionObserver mock
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
  callback
})) as any;

describe('useInfiniteScroll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('옵저버가 ref 요소를 관찰한다', () => {
    // Given
    const onIntersect = jest.fn();
    const ref = { current: document.createElement('div') };

    // When
    renderHook(() => useInfiniteScroll(ref, onIntersect));

    // Then
    expect(IntersectionObserver).toHaveBeenCalledWith(expect.any(Function), { threshold: 0.1 });
    expect(mockObserve).toHaveBeenCalledWith(ref.current);
  });

  test('요소가 교차할 때 콜백이 호출된다', () => {
    // Given
    const onIntersect = jest.fn();
    const ref = { current: document.createElement('div') };

    // When
    renderHook(() => useInfiniteScroll(ref, onIntersect));

    // 옵저버 콜백 함수 가져오기
    const observerCallback = (global.IntersectionObserver as jest.Mock).mock.calls[0][0];

    // 교차 상태를 시뮬레이션
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    // Then
    expect(onIntersect).toHaveBeenCalledTimes(1);
  });

  test('요소가 교차하지 않을 때 콜백이 호출되지 않는다', () => {
    // Given
    const onIntersect = jest.fn();
    const ref = { current: document.createElement('div') };

    // When
    renderHook(() => useInfiniteScroll(ref, onIntersect));

    // 옵저버 콜백 함수 가져오기
    const observerCallback = (global.IntersectionObserver as jest.Mock).mock.calls[0][0];

    // 교차하지 않는 상태를 시뮬레이션
    act(() => {
      observerCallback([{ isIntersecting: false }]);
    });

    // Then
    expect(onIntersect).not.toHaveBeenCalled();
  });

  test('언마운트 시 옵저버가 정리된다', () => {
    // Given
    const onIntersect = jest.fn();
    const ref = { current: document.createElement('div') };

    // When
    const { unmount } = renderHook(() => useInfiniteScroll(ref, onIntersect));
    unmount();

    // Then
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});
