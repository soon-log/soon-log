import { FilterType } from '../_constants/webtoon-filter';

export type DayOfWeekType =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type PlatformType = 'naver' | 'kakao';

export interface ResponseWebtoons {
  lastUpdated: string;
  webtoons: Array<Webtoon>;
}

export interface Webtoon {
  id: number | string;
  title: string;
  author: string;
  link: string;
  dayOfWeek: DayOfWeekType | null;
  thumbnail: string;
  platform: PlatformType;
  recommendLevel?: 1 | 2 | 3;
}

export interface FavoriteWebtoon {
  title: string;
  level: 1 | 2 | 3;
}

export interface Favorites {
  lastUpdated: string;
  favorites: Array<FavoriteWebtoon>;
}

export type FilterType = (typeof FilterType)[keyof typeof FilterType];
