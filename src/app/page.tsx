import qs from 'query-string';
import { Suspense } from 'react';

import { LoadingPage } from '@/components/loading-page';
import { NotFoundLottieAnimation } from '@/components/not-found-lottie-animation/not-found-lottie-animation';
import { FilterState } from '@/types/mdx';

import { PostFilter } from './_components/post-filter/post-filter';

export default async function Home({ searchParams }: { searchParams: Promise<FilterState> }) {
  const { tags, category, search } = await searchParams;

  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'localhost:3000';
    const { categories, tags: availableTags } = await fetch(
      `${base}/api/posts/filters${tags || category || search ? `?${qs.stringify({ tags, category, search })}` : ''}`
    ).then((res) => res.json());

    return (
      <Suspense fallback={<LoadingPage />}>
        <div className="space-y-6" data-testid="filtered-post-list">
          <PostFilter categories={categories} tags={availableTags} />
          {/* <PostList posts={posts} /> */}
        </div>
      </Suspense>
    );
  } catch {
    return (
      <div className="absolute inset-0 z-[-10] flex flex-col items-center justify-center gap-4">
        <NotFoundLottieAnimation className="h-96 w-full max-w-96" />
        <p className="text-center text-xl font-bold">게시물을 불러오는데 실패했습니다.</p>
      </div>
    );
  }
}
