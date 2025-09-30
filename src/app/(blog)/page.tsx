import { PostFilter } from './_components/post-filter';
import { PostList } from './_components/post-list/post-list';

export default function Home() {
  return (
    <div className="space-y-6 px-2">
      <PostFilter />
      <PostList />
    </div>
  );
}
