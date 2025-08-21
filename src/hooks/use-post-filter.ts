import { useMemo } from 'react';

import { PostMetadata } from '@/types/mdx';

interface PostFilterHookResult {
  availableCategories: string[];
  availableTags: string[];
}

export function usePostFilter({ posts }: { posts: PostMetadata[] }): PostFilterHookResult {
  const availableCategories = useMemo(() => {
    const updateCategories = posts
      .filter((post) => !!post.category)
      .map((post) => post.category!)
      .sort();
    return Array.from(new Set(updateCategories));
  }, [posts]);

  const availableTags = useMemo(() => {
    const updateTags = posts
      .filter((post) => !!post.tags)
      .flatMap((post) => post.tags!)
      .sort();
    return Array.from(new Set(updateTags));
  }, [posts]);

  return {
    availableCategories,
    availableTags
  };
}
