import { PostList } from '@/app/_components/post-list/post-list';

import { PostFilter } from './_components/post-filter/post-filter';

export default async function Home() {
  return (
    <div className="space-y-6">
      <PostFilter />
      <PostList />
    </div>
  );
}
