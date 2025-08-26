import { NextResponse } from 'next/server';

import { getProcessedPosts } from '../services';
import { parsePostsQueryParams } from '../utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters = parsePostsQueryParams(searchParams);

  try {
    const sortedPosts = await getProcessedPosts(filters);

    const categories = sortedPosts
      .filter((post) => !!post.category)
      .map((post) => post.category!)
      .sort();
    const tags = sortedPosts
      .filter((post) => !!post.tags)
      .flatMap((post) => post.tags!)
      .sort();

    const uniqueCategories = Array.from(new Set(categories));

    return NextResponse.json({
      categories: uniqueCategories,
      tags
    });
  } catch (error) {
    console.error('[API 오류] posts.json 읽기 실패:', error);
    return NextResponse.json(
      { message: '[API 오류] posts.json 읽기 실패: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
