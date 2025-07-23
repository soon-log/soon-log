import { Suspense } from 'react';

import { FilteredPostList } from '@/components/filtered-post-list';
import { Header } from '@/components/header';

export default async function Home() {
  try {
    const posts = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`).then((res) =>
      res.json()
    );

    return (
      <div className="container mx-auto px-4 py-8">
        <Header />
        <Suspense fallback={<div>Loading...</div>}>
          <FilteredPostList initialPosts={posts} />
        </Suspense>
      </div>
    );
  } catch {
    return (
      <div className="container mx-auto px-4 py-8">
        <Header />
        <p className="text-center text-red-500">게시물을 불러오는데 실패했습니다.</p>
      </div>
    );
  }
}
