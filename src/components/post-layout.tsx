import { Calendar } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import { formatDateToKorean } from '@/lib/date';
import { PostMetadata } from '@/types/mdx';

interface PostLayoutProps {
  meta: PostMetadata;
  children: React.ReactNode;
}

export default function PostLayout({ meta, children }: PostLayoutProps) {
  return (
    <article className="prose dark:prose-invert mx-auto max-w-3xl p-6">
      <header className="mb-8">
        {meta.thumbnail && (
          <div className="relative mb-8 h-96 w-full">
            <Image src={meta.thumbnail} alt={meta.title} fill className="rounded-lg object-cover" />
          </div>
        )}
        <div className="flex items-center justify-between">
          <time
            className="text-muted-foreground/80 inline-flex items-center gap-1.5 text-xs font-medium"
            dateTime={meta.date}
            aria-label={`게시일: ${formatDateToKorean(meta.date)}`}
          >
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="tracking-wide">{formatDateToKorean(meta.date)}</span>
          </time>
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
      </header>
      <div className="prose-lg">{children}</div>
    </article>
  );
}
