'use client';

import type { RefObject } from 'react';

import type { PostMetadata } from '@/entities/post';

import { usePostList } from '../model/use-post-list';

import { PostCard } from './post-card';

export function PostList() {
  const { posts, hasNextPage, loadMoreRef } = usePostList();
  const hasPosts = posts.length > 0;

  return (
    <div className="space-y-6">
      {hasPosts ? (
        <PostListItems posts={posts} hasNextPage={hasNextPage} loadMoreRef={loadMoreRef} />
      ) : (
        <PostListEmptyState />
      )}
    </div>
  );
}

type PostListItemsProps = {
  posts: Array<PostMetadata>;
  hasNextPage: boolean;
  loadMoreRef: RefObject<HTMLDivElement | null>;
};

function PostListItems({ posts, hasNextPage, loadMoreRef }: PostListItemsProps) {
  return (
    <div>
      <ul className="flex flex-col gap-4 pb-10">
        {posts.map((post) => (
          <li key={post.key}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
      {hasNextPage && <div ref={loadMoreRef} className="flex justify-center py-8" />}
    </div>
  );
}

function PostListEmptyState() {
  return <p className="text-center text-gray-500">게시물이 없습니다.</p>;
}
