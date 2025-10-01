export const DayOfWeek = {
  monday: 'monday',
  tuesday: 'tuesday',
  wednesday: 'wednesday',
  thursday: 'thursday',
  friday: 'friday',
  saturday: 'saturday',
  sunday: 'sunday'
} as const;

export type DayOfWeek = (typeof DayOfWeek)[keyof typeof DayOfWeek];

export const Platform = {
  naver: 'naver',
  kakao: 'kakao'
} as const;

export type Platform = (typeof Platform)[keyof typeof Platform];

interface NaverWebtoon {
  titleId: number;
  titleName: string;
  author: string;
  thumbnailUrl: string;
  up: boolean;
  rest: boolean;
  bm: boolean;
  adult: boolean;
  starScore: number;
  viewCount: number;
  openToday: boolean;
  potenUp: boolean;
  bestChallengeLevelUp: boolean;
  finish: boolean;
  new: boolean;
}

export interface ResponseNaverWeekdayWebtoons {
  titleListMap: Record<string, Array<NaverWebtoon>>;
  dayOfWeek: 'WEDNESDAY';
}

interface KaKaoWebtoon {
  id: string;
  content: {
    title: string;
    id: number;
    seoId: string;
    authors: { name: string }[];
    backgroundImage: string;
    featuredCharacterImageA: string;
    featuredCharacterImageB: string;
  };
}

export interface ResponseKakaoWeekdayWebtoons {
  data: [
    {
      id: string;
      cardGroups: [
        {
          cards: Array<KaKaoWebtoon>;
        }
      ];
    }
  ];
}

export interface Webtoon {
  id: number | string;
  title: string;
  author: string;
  link: string;
  dayOfWeek: DayOfWeek | null;
  thumbnail: string;
  platform: Platform;
}
