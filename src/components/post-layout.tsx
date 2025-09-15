import React from 'react';

import DateViewer from '@/components/date-viewer';
import { PostMetadata } from '@/types/mdx';

interface PostLayoutProps {
  meta: PostMetadata;
  children: React.ReactNode;
}

export default function PostLayout({ meta, children }: PostLayoutProps) {
  return (
    <article className="pb-6">
      <div>
        {meta.thumbnail && (
          <div
            className="relative mb-4 h-96 w-full rounded-lg bg-cover bg-center bg-no-repeat md:mb-6"
            style={{ backgroundImage: `url(${meta.thumbnail})` }}
          ></div>
        )}
        <div className="flex items-center justify-between gap-4">
          <DateViewer date={meta.date} />
          <div>
            {meta.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="ml-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200"
              >
                {tag}
              </span>
            ))}
            {meta.tags && meta.tags.length > 2 && (
              <span className="ml-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                +{meta.tags.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="prose-lg">{children}</div>
    </article>
  );
}
