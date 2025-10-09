import { DayOfWeekType, Webtoon } from '@/app/(webtoon)/_types/webtoon';
import { ResponseKakaoWeekdayWebtoons, ResponseNaverWeekdayWebtoons } from './types';
import { PLATFORM } from '@/app/(webtoon)/_constants/platform';

export const transformNaverWeekdayWebtoons = (
  webtoons: ResponseNaverWeekdayWebtoons
): Array<Webtoon> => {
  if (!webtoons?.titleListMap) {
    return [];
  }

  return Object.entries(webtoons.titleListMap)
    .map(([dayOfWeek, weekdayWebtoons]) => {
      if (!Array.isArray(weekdayWebtoons)) {
        return [];
      }

      return weekdayWebtoons.map((item) => {
        return {
          id: item.titleId,
          title: item.titleName,
          author: item.author,
          dayOfWeek: convertNaverDayOfWeekToDayOfWeek(dayOfWeek),
          link: `https://comic.naver.com/webtoon/list?titleId=${item.titleId}`,
          thumbnail: item.thumbnailUrl,
          platform: PLATFORM.naver.value
        };
      });
    })
    .flatMap((webtoons) => webtoons);
};

export const transformKakaoWebtoons = (
  response: ResponseKakaoWeekdayWebtoons,
  dayOfWeek: DayOfWeekType
): Array<Webtoon> => {
  if (!response?.data?.[0]?.cardGroups?.[0]?.cards) {
    return [];
  }

  return response.data[0].cardGroups[0].cards.map((card) => ({
    id: card.id,
    title: card.content.title,
    author: card.content.authors?.[0]?.name || '',
    dayOfWeek,
    link: `https://webtoon.kakao.com/content/${card.content.seoId}/${card.content.id}`,
    thumbnail: `${card.content.featuredCharacterImageA}.webp`,
    platform: PLATFORM.kakao.value
  }));
};

const convertNaverDayOfWeekToDayOfWeek = (dayOfWeek: string): DayOfWeekType | null => {
  switch (dayOfWeek) {
    case 'MONDAY':
      return 'monday';
    case 'TUESDAY':
      return 'tuesday';
    case 'WEDNESDAY':
      return 'wednesday';
    case 'THURSDAY':
      return 'thursday';
    case 'FRIDAY':
      return 'friday';
    case 'SATURDAY':
      return 'saturday';
    case 'SUNDAY':
      return 'sunday';
    default:
      return null;
  }
};
