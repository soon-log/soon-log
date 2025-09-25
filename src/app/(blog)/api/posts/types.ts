import { PostMetadata } from '@/app/(blog)/_types/mdx';

export interface PostsData {
  [category: string]: Array<PostMetadata>;
}
