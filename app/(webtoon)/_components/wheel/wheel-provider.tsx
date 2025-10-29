'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  MouseEvent,
  TouchEvent,
  ReactNode
} from 'react';

import { QUERY_KEY } from '../../_constants/query-key';
import { fetchWebtoons } from '../../_service/webtoons';
import { ResponseWebtoons, Webtoon } from '../../_types/webtoon';

import { WheelButton } from './wheel-button';

type WheelContextType = {
  isDragging: boolean;
  xDistance: number;
  cardIndex: number;
  rotationOffset: number;
  isShuffling: boolean;
  webtoons: Array<Webtoon>;
};

const WheelContext = createContext<WheelContextType | null>(null);

export function useWheel() {
  const context = useContext(WheelContext);
  if (!context) {
    throw new Error('useWheel must be used within WheelProvider');
  }
  return context;
}

type WheelProviderProps = {
  children: ReactNode;
};

export function WheelProvider({ children }: WheelProviderProps) {
  const searchParams = useSearchParams();
  const type = searchParams?.get('type') || null;

  const {
    data: { webtoons },
    refetch
  } = useSuspenseQuery<ResponseWebtoons>({
    queryKey: QUERY_KEY.WEBTOONS(type),
    queryFn: () => fetchWebtoons(type),
    refetchOnWindowFocus: false
  });
  const [isMounted, setIsMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [xDistance, setXDistance] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [rotationOffset, setRotationOffset] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);

  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const initialXDistanceRef = useRef(0);
  const isShufflingRef = useRef(false);

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setIsDragging(true);
      startXRef.current = e.clientX;
      lastXRef.current = e.clientX;
      lastTimeRef.current = Date.now();
      initialXDistanceRef.current = xDistance;
    },
    [xDistance]
  );

  const handleMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      e.preventDefault();
      if (!isDragging) return;

      const currentX = e.clientX;
      const currentTime = Date.now();
      const deltaX = currentX - lastXRef.current;
      const deltaTime = currentTime - lastTimeRef.current;

      // xDistance 업데이트 (누적)
      const newXDistance = initialXDistanceRef.current + (currentX - startXRef.current);
      setXDistance(newXDistance);

      // rotationOffset 실시간 계산 (소수점 포함)
      const newRotationOffset = newXDistance / 45;

      // velocity 계산: 0.1초(100ms) 이내에 X축 절대값 100px 이상 이동
      if (!isShufflingRef.current && deltaTime > 0 && deltaTime <= 100 && Math.abs(deltaX) >= 100) {
        // Fast 모드 진입
        isShufflingRef.current = true;
        setCardIndex(0);
        setRotationOffset(0);
        setIsShuffling(true);

        // API 호출하여 웹툰 재셔플
        refetch();

        // 1초 후 셔플 완료
        setTimeout(() => {
          setIsShuffling(false);
          isShufflingRef.current = false;
        }, 1000);
      } else if (!isShufflingRef.current) {
        setRotationOffset(newRotationOffset);
      }

      lastXRef.current = currentX;
      lastTimeRef.current = currentTime;
    },
    [isDragging, refetch]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);

    // rotationOffset을 반올림하여 최종 cardIndex 확정
    let finalCardIndex = Math.round(rotationOffset);

    // 모듈러 연산으로 유효한 범위로 변환
    const webtoonsLength = webtoons.length;
    if (finalCardIndex < 0) {
      finalCardIndex = ((finalCardIndex % webtoonsLength) + webtoonsLength) % webtoonsLength;
    } else if (finalCardIndex >= webtoonsLength) {
      finalCardIndex = finalCardIndex % webtoonsLength;
    }

    setCardIndex(finalCardIndex);
    setRotationOffset(finalCardIndex);
  }, [isDragging, rotationOffset, webtoons.length]);

  // 터치 이벤트 핸들러
  const handleTouchStart = useCallback(
    (e: TouchEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (!touch) return;

      setIsDragging(true);
      startXRef.current = touch.clientX;
      lastXRef.current = touch.clientX;
      lastTimeRef.current = Date.now();
      initialXDistanceRef.current = xDistance;
    },
    [xDistance]
  );

  const handleTouchMove = useCallback(
    (e: globalThis.TouchEvent) => {
      if (!isDragging) return;

      e.preventDefault();
      const touch = e.touches[0];
      if (!touch) return;

      const currentX = touch.clientX;
      const currentTime = Date.now();
      const deltaX = currentX - lastXRef.current;
      const deltaTime = currentTime - lastTimeRef.current;

      // xDistance 업데이트 (누적)
      const newXDistance = initialXDistanceRef.current + (currentX - startXRef.current);
      setXDistance(newXDistance);

      // rotationOffset 실시간 계산 (소수점 포함)
      const newRotationOffset = newXDistance / 45;

      // velocity 계산: 0.1초(100ms) 이내에 X축 절대값 100px 이상 이동
      if (!isShufflingRef.current && deltaTime > 0 && deltaTime <= 100 && Math.abs(deltaX) >= 100) {
        // Fast 모드 진입
        isShufflingRef.current = true;
        setCardIndex(0);
        setRotationOffset(0);
        setIsShuffling(true);

        // API 호출하여 웹툰 재셔플
        refetch();

        // 1초 후 셔플 완료
        setTimeout(() => {
          setIsShuffling(false);
          isShufflingRef.current = false;
        }, 1000);
      } else if (!isShufflingRef.current) {
        setRotationOffset(newRotationOffset);
      }

      lastXRef.current = currentX;
      lastTimeRef.current = currentTime;
    },
    [isDragging, refetch]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);

    // rotationOffset을 반올림하여 최종 cardIndex 확정
    let finalCardIndex = Math.round(rotationOffset);

    // 모듈러 연산으로 유효한 범위로 변환
    const webtoonsLength = webtoons.length;
    if (finalCardIndex < 0) {
      finalCardIndex = ((finalCardIndex % webtoonsLength) + webtoonsLength) % webtoonsLength;
    } else if (finalCardIndex >= webtoonsLength) {
      finalCardIndex = finalCardIndex % webtoonsLength;
    }

    setCardIndex(finalCardIndex);
    setRotationOffset(finalCardIndex);
  }, [isDragging, rotationOffset, webtoons.length]);

  // 전역 이벤트 리스너 등록
  useEffect(() => {
    const handleGlobalMouseMove = (e: globalThis.MouseEvent) => {
      handleMouseMove(e);
    };

    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    const handleGlobalTouchMove = (e: globalThis.TouchEvent) => {
      handleTouchMove(e);
    };

    const handleGlobalTouchEnd = () => {
      handleTouchEnd();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      window.addEventListener('touchend', handleGlobalTouchEnd);

      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
        window.removeEventListener('touchmove', handleGlobalTouchMove);
        window.removeEventListener('touchend', handleGlobalTouchEnd);
      };
    }
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <WheelContext.Provider
        value={{
          isDragging,
          xDistance,
          cardIndex,
          rotationOffset,
          isShuffling,
          webtoons
        }}
      >
        {children}
      </WheelContext.Provider>
      <WheelButton
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        xDistance={xDistance}
        isDragging={isDragging}
      />
    </>
  );
}
