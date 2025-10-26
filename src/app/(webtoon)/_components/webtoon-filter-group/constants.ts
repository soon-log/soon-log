import { FilterType as FilterTypeConstant } from '../../_constants/webtoon-filter';
import type { FilterType } from '../../_types/webtoon';

type FilterConfig = {
  src: string;
  fallback: string;
  shadowColor: string;
  bgColor: string;
};

export const FILTER_CONFIG: Record<FilterType, FilterConfig> = {
  [FilterTypeConstant.KAKAO]: {
    src: '/images/kakao-logo.png',
    fallback: 'K',
    shadowColor: 'shadow-[0_0_10px_#FFE600]',
    bgColor: 'bg-yellow-400'
  },
  [FilterTypeConstant.NAVER]: {
    src: '/images/naver-logo.png',
    fallback: 'N',
    shadowColor: 'shadow-[0_0_10px_#03C75A]',
    bgColor: 'bg-green-500'
  },
  [FilterTypeConstant.SOON]: {
    src: '/images/profile.png',
    fallback: 'S',
    shadowColor: 'shadow-[0_0_10px_#007AFF]',
    bgColor: 'bg-blue-500'
  }
};
