import { NextResponse } from 'next/server';

// no-op

import { parsePostsQueryParams } from '@/lib/url';

import { getProcessedPosts } from './services';
import { paginatePosts } from './utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters = parsePostsQueryParams(searchParams);
  const pageParam = searchParams.get('page');
  const perPageParam = searchParams.get('perPage');
  const page = pageParam ? parseInt(pageParam) : 1;
  const perPage = perPageParam ? parseInt(perPageParam) : 10;

  try {
    const sortedPosts = await getProcessedPosts(filters);

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
