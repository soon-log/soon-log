import postJSON from '../data/posts.json';
import { PostsData } from '../model/types';

export async function getPostsJson(): Promise<PostsData> {
  return postJSON;
}
