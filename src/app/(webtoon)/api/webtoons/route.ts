import path from 'path';

import { shuffle } from 'es-toolkit';
import { NextRequest, NextResponse } from 'next/server';

import { readCachedJson } from '@/utils/readCachedJson';

import { FilterType as FilterTypeConstant } from '../../_constants/webtoon-filter';
import type { Favorites, FilterType, ResponseWebtoons, Webtoon } from '../../_types/webtoon';

const WEBTOONS_FILE_PATH = path.join(process.cwd(), 'webtoon', 'webtoons.json');
const FAVORITES_FILE_PATH = path.join(process.cwd(), 'webtoon', 'favorites.json');

const ALLOWED_TYPES = new Set(Object.values(FilterTypeConstant));
type FavoriteLevel = Favorites['favorites'][number]['level'];

const favoritesCache: {
  data: Favorites | null;
  map: Map<string, FavoriteLevel> | null;
} = {
  data: null,
  map: null
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as FilterType | null;

    if (type && !ALLOWED_TYPES.has(type)) {
      return NextResponse.json({ message: '[API 오류] 잘못된 type 값입니다.' }, { status: 400 });
    }

    const { webtoons: originalWebtoons } =
      await readCachedJson<ResponseWebtoons>(WEBTOONS_FILE_PATH);

    let filteredWebtoons: Array<Webtoon> = [];

    switch (type) {
      case FilterTypeConstant.KAKAO:
        filteredWebtoons = originalWebtoons.filter((webtoon) => webtoon.platform === 'kakao');
        break;
      case FilterTypeConstant.NAVER:
        filteredWebtoons = originalWebtoons.filter((webtoon) => webtoon.platform === 'naver');
        break;
      case FilterTypeConstant.SOON:
        const favoritesData = await readCachedJson<Favorites>(FAVORITES_FILE_PATH);
        const favoritesMap = getFavoritesMap(favoritesData);

        filteredWebtoons = originalWebtoons
          .filter(({ title }) => favoritesMap.has(title))
          .map((webtoon) => ({ ...webtoon, recommendLevel: favoritesMap.get(webtoon.title)! }));
        break;
      default:
        filteredWebtoons = originalWebtoons;
        break;
    }
    return NextResponse.json({
      webtoons: shuffle([...filteredWebtoons])
    });
  } catch (error) {
    console.error('[API 오류] webtoons.json 읽기 실패:', error);
    return NextResponse.json({ message: '[API 오류] webtoons.json 읽기 실패' }, { status: 500 });
  }
}

function getFavoritesMap(favoritesData: Favorites) {
  if (
    favoritesCache.data &&
    favoritesCache.data.lastUpdated === favoritesData.lastUpdated &&
    favoritesCache.map
  ) {
    return favoritesCache.map;
  }

  const map = new Map<string, FavoriteLevel>(
    favoritesData.favorites.map((favorite) => [favorite.title, favorite.level])
  );

  favoritesCache.data = favoritesData;
  favoritesCache.map = map;

  return map;
}
