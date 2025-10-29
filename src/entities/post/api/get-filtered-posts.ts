import { buildAbsoluteUrl } from '@/shared/utils';

export async function getFilteredPosts() {
  const response = await fetch(buildAbsoluteUrl('/api/posts/filters'));
  return response.json();
}
