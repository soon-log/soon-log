import { buildAbsoluteUrl } from '@/shared/utils';

import { ResponseWebtoons } from '../_types/webtoon';

export const fetchWebtoons = async (type: string | null): Promise<ResponseWebtoons> => {
  const url = type
    ? buildAbsoluteUrl(`/api/webtoons?type=${type}`)
    : buildAbsoluteUrl('/api/webtoons');
  const response = await fetch(url);
  return response.json();
};
