import React from 'react';

import DateViewer from '@/components/date-viewer';
import { PostMetadata } from '@/types/mdx';

interface PostLayoutProps {
  meta: PostMetadata;
  children: React.ReactNode;
}

export default function PostLayout({ meta, children }: PostLayoutProps) {
  return (
    <article>
      <div>
        {meta.thumbnail && (
          <div
            className="relative mb-8 h-96 w-full rounded-lg bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${meta.thumbnail})` }}
          ></div>
        )}
        <div className="flex items-center justify-between">
          <DateViewer date={meta.date} />
          <div>
            {meta.tags?.map((tag) => (
              <span
                key={tag}
                className="mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="prose-lg">{children}</div>
    </article>
  );
}
