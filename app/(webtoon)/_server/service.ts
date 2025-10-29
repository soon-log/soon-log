import { shuffle } from 'es-toolkit';

import { WEBTOON_FILTER } from '../_constants/webtoon-filter';
import type { Favorites, Webtoon, FilterType } from '../_types/webtoon';

type FavoriteLevel = Favorites['favorites'][number]['level'];

export function buildFavoritesMap(favorites: Favorites): Map<string, FavoriteLevel> {
  return new Map(favorites.favorites.map(({ title, level }) => [title, level]));
}

export function filterWebtoons({
  type,
  originals,
  favorites
}: {
  type: FilterType | null;
  originals: Array<Webtoon>;
  favorites?: Favorites;
}): Array<Webtoon> {
  switch (type) {
    case WEBTOON_FILTER.KAKAO:
      return originals.filter((w) => w.platform === 'kakao');
    case WEBTOON_FILTER.NAVER:
      return originals.filter((w) => w.platform === 'naver');
    case WEBTOON_FILTER.SOON: {
      if (!favorites) return [];
      const map = buildFavoritesMap(favorites);
      return originals
        .filter(({ title }) => map.has(title))
        .map((w) => ({ ...w, recommendLevel: map.get(w.title)! }));
    }
    default:
      return originals;
  }
}

export function shuffleWebtoons(webtoons: Array<Webtoon>): Array<Webtoon> {
  return shuffle([...webtoons]);
}
