import { ResponseNaverWeekdayWebtoons, Webtoon } from './types';

export const transformNaverWeekdayWebtoons = (
  webtoons: ResponseNaverWeekdayWebtoons
): Array<Webtoon> => {
  if (!webtoons?.titleListMap) {
    return [];
  }

  return Object.values(webtoons.titleListMap).flatMap((weekdayWebtoons) => {
    if (!Array.isArray(weekdayWebtoons)) {
      return [];
    }

    return weekdayWebtoons.map((item) => {
      return {
        id: item.titleId,
        title: item.titleName,
        author: item.author,
        link: `https://comic.naver.com/webtoon/list?titleId=${item.titleId}`,
        thumbnail: item.thumbnailUrl
      };
    });
  });
};
