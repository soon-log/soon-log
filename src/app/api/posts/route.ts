import fs from 'fs/promises';
import path from 'path';

import { NextResponse } from 'next/server';

import { PostMetadata } from '@/types/mdx';

interface PostsData {
  [category: string]: PostMetadata[];
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'posts', 'posts.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data: PostsData = JSON.parse(fileContents);

    // 모든 카테고리 게시물 평탄화
    const allPosts = Object.values(data).flat();

    // 날짜 기준 최신순 정렬
    return NextResponse.json(
      allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  } catch (error) {
    console.error('[API 오류] posts.json 파일 읽기 실패:', error);
    throw error;
  }
}
