import axios from 'axios';

import { ResponseNaverWeekdayWebtoons, Webtoon } from './types';
import { transformNaverWeekdayWebtoons } from './utils';

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

export { getNaverWeekdayWebtoons };
