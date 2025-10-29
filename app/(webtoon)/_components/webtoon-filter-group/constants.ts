import { WEBTOON_FILTER } from '../../_constants/webtoon-filter';
import type { FilterType } from '../../_types/webtoon';

type FilterConfig = {
  src: string;
  fallback: string;
  shadowColor: string;
  bgColor: string;
};

export const FILTER_CONFIG: Record<FilterType, FilterConfig> = {
  [WEBTOON_FILTER.KAKAO]: {
    src: '/images/kakao-logo.png',
    fallback: 'K',
    shadowColor: 'shadow-[0_0_10px_#FFE600]',
    bgColor: 'bg-yellow-400'
  },
  [WEBTOON_FILTER.NAVER]: {
    src: '/images/naver-logo.png',
    fallback: 'N',
    shadowColor: 'shadow-[0_0_10px_#03C75A]',
    bgColor: 'bg-green-500'
  },
  [WEBTOON_FILTER.SOON]: {
    src: '/images/profile.png',
    fallback: 'S',
    shadowColor: 'shadow-[0_0_10px_#007AFF]',
    bgColor: 'bg-blue-500'
  }
};
