import { useRef } from 'react';

type UseRotationVelocityProps = {
  threshold?: number;
};

type RotationVelocityResult = {
  startTracking: (rotation: number) => void;
  calculateVelocity: (currentRotation: number) => {
    isFast: boolean;
    velocity: number;
    totalRotation: number;
    duration: number;
  };
};

/**
 * 회전 속도 계산 훅
 * @param threshold 빠른 드래그로 판단하는 각속도 임계값 (도/초)
 * @returns startTracking, calculateVelocity
 * startTracking: 회전 속도 추적 시작
 * calculateVelocity: 회전 속도 계산
 * - isFast: 빠른 드래그 여부
 * - velocity: 도/초 단위
 * - totalRotation: 전체 회전 각도
 * - duration: 드래그 지속 시간 (초)
 */
export function useRotationVelocity({
  threshold = 180 // 기본값: 0.5초에 90도, 1초에 180도
}: UseRotationVelocityProps = {}): RotationVelocityResult {
  const startTimeRef = useRef(0);
  const startRotationRef = useRef(0);

  const startTracking = (rotation: number) => {
    startTimeRef.current = Date.now();
    startRotationRef.current = rotation;
  };

  const calculateVelocity = (currentRotation: number) => {
    const totalRotation = Math.abs(currentRotation - startRotationRef.current);
    const endTime = Date.now();
    const duration = (endTime - startTimeRef.current) / 1000; // 밀리초 → 초
    const velocity = duration > 0 ? totalRotation / duration : 0;

    return {
      isFast: velocity >= threshold,
      velocity,
      totalRotation,
      duration
    };
  };

  return {
    startTracking,
    calculateVelocity
  };
}
