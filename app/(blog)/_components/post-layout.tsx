import React from 'react';

import { PostMetadata } from '@/entities/post';
import { DateViewer, CondensedTagList } from '@/shared/components';

interface PostLayoutProps {
  meta: PostMetadata;
  children: React.ReactNode;
}

export function PostLayout({ meta, children }: PostLayoutProps) {
  return (
    <article className="mx-3 pb-6">
      <div>
        {meta.thumbnail && (
          <div
            className="relative mb-4 h-56 w-full rounded-lg bg-cover bg-center bg-no-repeat md:mb-6 md:h-96"
            style={{ backgroundImage: `url(${meta.thumbnail})` }}
          ></div>
        )}
        <div className="flex items-center justify-between gap-4">
          <DateViewer date={meta.date} />
          <CondensedTagList tags={meta.tags || []} />
        </div>
      </div>
      <div className="prose-lg">{children}</div>
    </article>
  );
}
