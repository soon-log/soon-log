import { buildAbsoluteUrl } from '@/utils/http';

import { ResponseWebtoons } from '../_types/webtoon';

export const fetchWebtoons = async (): Promise<ResponseWebtoons> => {
  const response = await fetch(buildAbsoluteUrl('/api/webtoons'));
  return response.json();
};
