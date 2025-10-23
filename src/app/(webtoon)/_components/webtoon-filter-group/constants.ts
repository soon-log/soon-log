export const FilterType = {
  SOON: 'soon',
  KAKAO: 'kakao',
  NAVER: 'naver'
} as const;

export type FilterType = (typeof FilterType)[keyof typeof FilterType];

type FilterConfig = {
  src: string;
  fallback: string;
  shadowColor: string;
  bgColor: string;
};

export const FILTER_CONFIG: Record<FilterType, FilterConfig> = {
  [FilterType.KAKAO]: {
    src: '/images/kakao-logo.png',
    fallback: 'K',
    shadowColor: 'shadow-[0_0_10px_#FFE600]',
    bgColor: 'bg-yellow-400'
  },
  [FilterType.NAVER]: {
    src: '/images/naver-logo.png',
    fallback: 'N',
    shadowColor: 'shadow-[0_0_10px_#03C75A]',
    bgColor: 'bg-green-500'
  },
  [FilterType.SOON]: {
    src: '/images/profile.png',
    fallback: 'S',
    shadowColor: 'shadow-[0_0_10px_#007AFF]',
    bgColor: 'bg-blue-500'
  }
};
