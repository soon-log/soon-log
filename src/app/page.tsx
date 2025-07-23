import { Suspense } from 'react';

import { FilteredPostList } from '@/components/filtered-post-list';
import { NotFoundLottieAnimation } from '@/components/not-found-lottie-animation/not-found-lottie-animation';

export default async function Home() {
  try {
    const posts = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`).then((res) =>
      res.json()
    );

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <FilteredPostList initialPosts={posts} />
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
