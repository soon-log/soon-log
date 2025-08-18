import { Suspense } from 'react';

import { LoadingPage } from '@/components/loading-page';
import { NotFoundLottieAnimation } from '@/components/not-found-lottie-animation/not-found-lottie-animation';
import { PostList } from '@/components/post-list';

export default async function Home() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'localhost:3000';
    const posts = await fetch(`${base}/api/posts`).then((res) => res.json());

    return (
      <Suspense fallback={<LoadingPage />}>
        <PostList data={posts} />
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
