import { buildAbsoluteUrl } from '@/utils/http';

export const fetchFilters = async () => {
  const response = await fetch(buildAbsoluteUrl('/api/posts/filters'));
  return response.json();
};
