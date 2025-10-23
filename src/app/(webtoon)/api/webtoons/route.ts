import { promises as fs } from 'fs';
import path from 'path';

import { shuffle } from 'es-toolkit';
import { NextRequest, NextResponse } from 'next/server';

import { FilterType } from '@/app/(webtoon)/_components/webtoon-filter-group/constants';

import type { Favorites, ResponseWebtoons, Webtoon } from '../../_types/webtoon';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as FilterType | null;

    const allowedTypes = new Set([FilterType.KAKAO, FilterType.NAVER, FilterType.SOON]);

    if (type && !allowedTypes.has(type)) {
      return NextResponse.json({ message: '[API 오류] 잘못된 타입입니다.' }, { status: 400 });
    }

    const webtoonsFilePath = path.join(process.cwd(), 'webtoon', 'webtoons.json');
    const webtoonsFileContent = await fs.readFile(webtoonsFilePath, 'utf-8');
    const { webtoons: originalWebtoons }: ResponseWebtoons = JSON.parse(webtoonsFileContent);

    let filteredWebtoons: Array<Webtoon> = [];

    switch (type) {
      case 'kakao':
        filteredWebtoons = originalWebtoons.filter((webtoon) => webtoon.platform === 'kakao');
        break;
      case 'naver':
        filteredWebtoons = originalWebtoons.filter((webtoon) => webtoon.platform === 'naver');
        break;
      case 'soon':
        const favoritesFilePath = path.join(process.cwd(), 'webtoon', 'favorites.json');
        const favoritesFileContent = await fs.readFile(favoritesFilePath, 'utf-8');
        const favoritesData: Favorites = JSON.parse(favoritesFileContent);

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
