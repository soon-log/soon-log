import { buildAbsoluteUrl } from '@/utils/http';

import { ResponseWebtoons } from '../_types/webtoon';

export const fetchWebtoons = async (type: string | null): Promise<ResponseWebtoons> => {
  const url = type
    ? buildAbsoluteUrl(`/api/webtoons?type=${type}`)
    : buildAbsoluteUrl('/api/webtoons');
  const response = await fetch(url);
  return response.json();
};
