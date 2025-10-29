import { NextResponse } from 'next/server';

import { getPostsJson } from '@/entities/post';
import { generateRSSFeed } from '@/utils/rss';

export async function GET() {
  try {
    // 포스트 데이터 로드
    const data = await getPostsJson();

    // 모든 카테고리의 게시물을 하나의 배열로 평탄화
    const allPosts = Object.values(data).flat();

    // 사이트 URL 설정
    const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

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
