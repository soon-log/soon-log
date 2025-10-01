export const NaverDayOfWeek = {
  MONDAY: 'MONDAY',
  TUESDAY: 'TUESDAY',
  WEDNESDAY: 'WEDNESDAY',
  THURSDAY: 'THURSDAY',
  FRIDAY: 'FRIDAY',
  SATURDAY: 'SATURDAY',
  SUNDAY: 'SUNDAY'
} as const;

export type NaverDayOfWeek = (typeof NaverDayOfWeek)[keyof typeof NaverDayOfWeek];
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
  titleListMap: Record<NaverDayOfWeek, Array<NaverWebtoon>>;
  dayOfWeek: 'WEDNESDAY';
}

export interface Webtoon {
  id: number;
  title: string;
  author: string;
  link: string;
  thumbnail: string;
}
