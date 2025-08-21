import { FilterState, PostMetadata } from '@/types/mdx';

export const filterPosts = ({
  posts,
  filters
}: {
  posts: PostMetadata[];
  filters: FilterState;
}) => {
  return posts.filter((post) => {
    if (filters.category && post.category !== filters.category) {
      return false;
    }

    if (filters.tags.length > 0) {
      const hasAllTags = filters.tags.every((tag) => post.tags?.includes(tag));
      if (!hasAllTags) return false;
    }

    if (filters.search && filters.search.trim() !== '') {
      const searchTerm = filters.search.toLowerCase();
      const titleMatch = post.title.toLowerCase().includes(searchTerm);
      const summaryMatch = post.summary?.toLowerCase().includes(searchTerm);

      if (!(titleMatch || summaryMatch)) {
        return false;
      }
    }

    return true;
  });
};
