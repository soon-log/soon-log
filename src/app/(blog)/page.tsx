import { PostFilter } from './_components/post-filter';
import { PostList } from './_components/post-list/post-list';

export default function Home() {
  return (
    <div className="mx-3 space-y-6">
      <PostFilter />
      <PostList />
    </div>
  );
}
