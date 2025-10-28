import path from 'path';

import { NextRequest, NextResponse } from 'next/server';

import { filterWebtoons, shuffleWebtoons } from '@/app/(webtoon)/_server/service';
import { readCachedJson } from '@/utils/readCachedJson';

import { WEBTOON_FILTER } from '../../_constants/webtoon-filter';
import type { Favorites, FilterType, ResponseWebtoons } from '../../_types/webtoon';

const WEBTOONS_FILE_PATH = path.join(process.cwd(), 'webtoon', 'webtoons.json');
const FAVORITES_FILE_PATH = path.join(process.cwd(), 'webtoon', 'favorites.json');

const ALLOWED_TYPES = new Set(Object.values(WEBTOON_FILTER));

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as FilterType | null;

    if (type && !ALLOWED_TYPES.has(type)) {
      return NextResponse.json({ message: '[API 오류] 잘못된 type 값입니다.' }, { status: 400 });
    }

    const { webtoons: originalWebtoons } =
      await readCachedJson<ResponseWebtoons>(WEBTOONS_FILE_PATH);

    const favoritesData =
      type === WEBTOON_FILTER.SOON
        ? await readCachedJson<Favorites>(FAVORITES_FILE_PATH)
        : undefined;

    const filtered = filterWebtoons({
      type,
      originals: originalWebtoons,
      favorites: favoritesData
    });
    return NextResponse.json({ webtoons: shuffleWebtoons(filtered) });
  } catch (error) {
    console.error('[API 오류] webtoons.json 읽기 실패:', error);
    return NextResponse.json({ message: '[API 오류] webtoons.json 읽기 실패' }, { status: 500 });
  }
}
