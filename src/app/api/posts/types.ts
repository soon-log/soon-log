import { PostMetadata } from '@/types/mdx';

export interface PostsData {
  [category: string]: PostMetadata[];
}
