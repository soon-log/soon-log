import { promises as fs } from 'fs';
import path from 'path';

import { shuffle } from 'es-toolkit';
import { NextRequest, NextResponse } from 'next/server';

import { FilterType } from '@/app/(webtoon)/_components/webtoon-filter-group/constants';

import type { Favorites, ResponseWebtoons, Webtoon } from '../../_types/webtoon';

type JsonCacheEntry<T> = {
  value: T;
  mtimeMs: number | null;
};

const jsonCache = new Map<string, JsonCacheEntry<unknown>>();
const isDev = process.env.NODE_ENV !== 'production';

const WEBTOONS_FILE_PATH = path.join(process.cwd(), 'webtoon', 'webtoons.json');
const FAVORITES_FILE_PATH = path.join(process.cwd(), 'webtoon', 'favorites.json');

async function readCachedJson<T>(filePath: string): Promise<T> {
  const cached = jsonCache.get(filePath) as JsonCacheEntry<T> | undefined;

  if (!isDev && cached) {
    return cached.value;
  }

  let currentMtime: number | null = null;

  if (isDev) {
    const stat = await fs.stat(filePath);
    currentMtime = stat.mtimeMs;
    if (cached && cached.mtimeMs === currentMtime) {
      return cached.value;
    }
  } else if (cached) {
    return cached.value;
  }

  const fileContent = await fs.readFile(filePath, 'utf-8');
  const parsed = JSON.parse(fileContent) as T;

  jsonCache.set(filePath, { value: parsed, mtimeMs: currentMtime });

  return parsed;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as FilterType | null;

    const allowedTypes = new Set([FilterType.KAKAO, FilterType.NAVER, FilterType.SOON]);

    if (type && !allowedTypes.has(type)) {
      return NextResponse.json({ message: '[API 오류] 잘못된 타입입니다.' }, { status: 400 });
    }

    const { webtoons: originalWebtoons } =
      await readCachedJson<ResponseWebtoons>(WEBTOONS_FILE_PATH);

    let filteredWebtoons: Array<Webtoon> = [];

    switch (type) {
      case 'kakao':
        filteredWebtoons = originalWebtoons.filter((webtoon) => webtoon.platform === 'kakao');
        break;
      case 'naver':
        filteredWebtoons = originalWebtoons.filter((webtoon) => webtoon.platform === 'naver');
        break;
      case 'soon':
        const favoritesData = await readCachedJson<Favorites>(FAVORITES_FILE_PATH);

        const favoritesMap = new Map(favoritesData.favorites.map((fav) => [fav.title, fav.level]));

        filteredWebtoons = originalWebtoons
          .filter((webtoon) => favoritesMap.has(webtoon.title))
          .map((webtoon) => ({
            ...webtoon,
            recommendLevel: favoritesMap.get(webtoon.title)
          }));
        break;
      default:
        filteredWebtoons = originalWebtoons;
        break;
    }
    return NextResponse.json({
      webtoons: shuffle(filteredWebtoons)
    });
  } catch (error) {
    console.error('[API 오류] webtoons.json 읽기 실패:', error);
    return NextResponse.json(
      { message: '[API 오류] webtoons.json 읽기 실패: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
