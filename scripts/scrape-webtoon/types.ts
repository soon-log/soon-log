interface NaverWebtoon {
  titleId: number;
  titleName: string;
  author: string;
  thumbnailUrl: string;
  up: boolean;
  rest: boolean;
  bm: boolean;
  adult: boolean;
  starScore: number;
  viewCount: number;
  openToday: boolean;
  potenUp: boolean;
  bestChallengeLevelUp: boolean;
  finish: boolean;
  new: boolean;
}

export interface ResponseNaverWeekdayWebtoons {
  titleListMap: Record<string, Array<NaverWebtoon>>;
  dayOfWeek: 'WEDNESDAY';
}

interface KaKaoWebtoon {
  id: string;
  content: {
    title: string;
    id: number;
    seoId: string;
    authors: { name: string }[];
    backgroundImage: string;
    featuredCharacterImageA: string;
    featuredCharacterImageB: string;
  };
}

export interface ResponseKakaoWeekdayWebtoons {
  data: [
    {
      id: string;
      cardGroups: [
        {
          cards: Array<KaKaoWebtoon>;
        }
      ];
    }
  ];
}
