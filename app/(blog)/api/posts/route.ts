import { NextResponse } from 'next/server';

// no-op

import {
  parsePostsQueryParams,
  parsePageQueryParams,
  getSortedPosts,
  paginatePosts
} from '@/entities/post';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters = parsePostsQueryParams(searchParams);
  const { page, perPage } = parsePageQueryParams(searchParams);

  try {
    const sortedPosts = await getSortedPosts(filters);

    const paginatedPosts = paginatePosts({
      posts: sortedPosts,
      page,
      perPage
    });

    return NextResponse.json(paginatedPosts);
  } catch (error) {
    console.error('[API 오류] posts.json 읽기 실패:', error);
    return NextResponse.json(
      { message: '[API 오류] posts.json 읽기 실패: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
