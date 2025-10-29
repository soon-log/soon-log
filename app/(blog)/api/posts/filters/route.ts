import { NextResponse } from 'next/server';

import { parsePostsQueryParams, getPostFilters } from '@/entities/post';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filterState = parsePostsQueryParams(searchParams);
    const filters = await getPostFilters(filterState);

    return NextResponse.json(filters);
  } catch (error) {
    console.error('[posts/filters] 요청 실패:', error);
    return NextResponse.json({ message: 'post/filters 요청에 실패했습니다.' }, { status: 500 });
  }
}
