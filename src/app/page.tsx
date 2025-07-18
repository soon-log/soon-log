import { promises as fs } from 'fs';
import path from 'path';

import { Suspense } from 'react';

import { FilteredPostList } from '@/components/filtered-post-list';
import { Header } from '@/components/header';
import { PostMetadata } from '@/types/mdx';

interface PostsData {
  [category: string]: PostMetadata[];
}

async function getPosts(): Promise<PostMetadata[]> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'posts', 'posts.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data: PostsData = JSON.parse(fileContents);

    // 모든 카테고리의 게시물을 하나의 배열로 평탄화
    const allPosts = Object.values(data).flat();

    // 날짜 기준 최신순 정렬
    return allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error reading posts file:', error);
    throw error;
  }
}

export default async function Home() {
  try {
    const posts = await getPosts();

    return (
      <div className="container mx-auto px-4 py-8">
        <Header />
        <Suspense fallback={<div>Loading...</div>}>
          <FilteredPostList initialPosts={posts} />
        </Suspense>
      </div>
    );
  } catch {
    return (
      <div className="container mx-auto px-4 py-8">
        <Header />
        <p className="text-center text-red-500">게시물을 불러오는데 실패했습니다.</p>
      </div>
    );
  }
}
