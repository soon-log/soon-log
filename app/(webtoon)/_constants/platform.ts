import { PlatformType } from '../_types/webtoon';

export const PLATFORM: Record<PlatformType, { label: string; value: PlatformType }> = {
  naver: {
    label: '네이버',
    value: 'naver'
  },
  kakao: {
    label: '카카오',
    value: 'kakao'
  }
};
