import React from 'react';

import DateViewer from '@/components/date-viewer';
import { OmittedTags } from '@/components/omitted-tags';
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
          <OmittedTags tags={meta.tags || []} />
        </div>
      </div>
      <div className="prose-lg">{children}</div>
    </article>
  );
}
