import { buildAbsoluteUrl } from '@/lib/http';

export const fetchFilters = async () => {
  const response = await fetch(buildAbsoluteUrl('/api/posts/filters'));
  return response.json();
};
