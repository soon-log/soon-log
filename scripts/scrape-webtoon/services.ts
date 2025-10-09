import axios from 'axios';

import { ResponseKakaoWeekdayWebtoons, ResponseNaverWeekdayWebtoons } from './types';
import { transformKakaoWebtoons, transformNaverWeekdayWebtoons } from './utils';
import { type Webtoon, type DayOfWeekType } from '@/app/(webtoon)/_types/webtoon';
import { DAY_OF_WEEK } from '@/app/(webtoon)/_constants/day-of-week';

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

const KAKAO_WEBTOON_DAY_OF_WEEK: Record<string, DayOfWeekType> = {
  mon: DAY_OF_WEEK.monday.value,
  tue: DAY_OF_WEEK.tuesday.value,
  wed: DAY_OF_WEEK.wednesday.value,
  thu: DAY_OF_WEEK.thursday.value,
  fri: DAY_OF_WEEK.friday.value,
  sat: DAY_OF_WEEK.saturday.value,
  sun: DAY_OF_WEEK.sunday.value
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
