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
}
