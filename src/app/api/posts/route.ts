import { NextResponse } from 'next/server';

import { PostMetadata } from '@/types/mdx';

interface PostsData {
  [category: string]: PostMetadata[];
}

export async function GET(request: Request) {
  try {
    const { origin } = new URL(request.url);
    const res = await fetch(`${origin}/posts/posts.json`);
    if (!res.ok) {
      return NextResponse.json({ message: 'posts.json 응답 실패' }, { status: 500 });
    }

    // 모든 카테고리 게시물 평탄화
    const data: PostsData = await res.json();

    const allPosts = Object.values(data).flat();

    // 날짜 기준 최신순 정렬
    return NextResponse.json(
      allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  } catch (error) {
    console.error('[API 오류] posts.json 읽기 실패:', error);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}
