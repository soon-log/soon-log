import { promises as fs } from 'fs';
import path from 'path';

import { NextResponse } from 'next/server';

import { generateRSSFeed } from '@/lib/rss';
import { PostMetadata } from '@/types/mdx';

interface PostsData {
  [category: string]: Array<PostMetadata>;
}

export async function GET() {
  try {
    // 포스트 데이터 로드
    const filePath = path.join(process.cwd(), 'public', 'posts', 'posts.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data: PostsData = JSON.parse(fileContents);

    // 모든 카테고리의 게시물을 하나의 배열로 평탄화
    const allPosts = Object.values(data).flat();

    // 사이트 URL 설정
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://soon-log.com';

    // RSS 피드 생성
    const rssXml = generateRSSFeed(allPosts, siteUrl);

    // XML 응답 반환
    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  } catch (error) {
    console.error('RSS 피드 생성 실패:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
