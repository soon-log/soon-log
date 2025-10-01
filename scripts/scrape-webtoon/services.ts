import axios from 'axios';

import {
  DayOfWeek,
  ResponseKakaoWeekdayWebtoons,
  ResponseNaverWeekdayWebtoons,
  Webtoon
} from './types';
import { transformKakaoWebtoons, transformNaverWeekdayWebtoons } from './utils';

const axiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; WebtoonScraper/1.0)'
  }
});

async function getNaverWeekdayWebtoons(): Promise<Array<Webtoon>> {
  const { data } = await axiosInstance<ResponseNaverWeekdayWebtoons>(
    'https://comic.naver.com/api/webtoon/titlelist/weekday?order=user'
  );

  if (!data?.titleListMap || typeof data.titleListMap !== 'object') {
    throw new Error('Invalid API response format');
  }

  return transformNaverWeekdayWebtoons(data);
}

const KAKAO_WEBTOON_DAY_OF_WEEK: Record<string, DayOfWeek> = {
  mon: DayOfWeek.monday,
  tue: DayOfWeek.tuesday,
  wed: DayOfWeek.wednesday,
  thu: DayOfWeek.thursday,
  fri: DayOfWeek.friday,
  sat: DayOfWeek.saturday,
  sun: DayOfWeek.sunday
};

async function getKakaoWebtoons(): Promise<Array<Webtoon>> {
  const webtoons = await Promise.all(
    Object.entries(KAKAO_WEBTOON_DAY_OF_WEEK).map(async ([key, dayOfWeek]) => {
      const { data } = await axiosInstance<ResponseKakaoWeekdayWebtoons>(
        `https://gateway-kw.kakao.com/section/v2/timetables/days?placement=timetable_${key}_free_publishing`
      );
      return transformKakaoWebtoons(data, dayOfWeek);
    })
  );

  return webtoons.flat();
}

export { getKakaoWebtoons, getNaverWeekdayWebtoons };
