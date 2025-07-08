import { Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateToKorean } from '@/lib/date';
import { PostMetadata } from '@/types/mdx';

interface PostCardProps {
  post: PostMetadata;
}

export function PostCard({ post }: PostCardProps) {
  const { key, title, date, tags, category, summary, thumbnail } = post;

  return (
    <Card className="group p-0 transition-all duration-300 hover:shadow-md hover:shadow-black/5">
      <article>
        <Link
          href={`/post/${key}`}
          className="focus-visible:ring-primary block overflow-hidden rounded-xl py-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          aria-label={`${title} 게시물 읽기`}
        >
          <div className="flex h-full flex-col md:flex-row">
            {/* 썸네일 영역 - 모바일: 상단, 데스크톱: 좌측 */}
            {thumbnail && (
              <div className="relative aspect-video w-full overflow-hidden md:aspect-auto md:w-48 md:flex-shrink-0">
                <Image
                  src={thumbnail}
                  alt={`${title} 썸네일 이미지`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-103"
                />
                {/* 썸네일 위 카테고리 배지 */}
                {category && (
                  <div className="absolute top-3 left-3">
                    <Badge
                      variant="secondary"
                      className="bg-white/90 text-gray-900 backdrop-blur-sm"
                      aria-label={`카테고리: ${category}`}
                    >
                      {category}
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {/* 컨텐츠 영역 - 모바일: 하단, 데스크톱: 우측 */}
            <div className="mt-4 flex min-h-0 flex-1 flex-col md:mt-0">
              <CardHeader className="flex-shrink-0 space-y-3">
                {/* 카테고리 (썸네일이 없을 때만 표시) */}
                {!thumbnail && category && (
                  <div data-testid="post-category">
                    <Badge
                      variant="secondary"
                      className="w-fit"
                      aria-label={`카테고리: ${category}`}
                    >
                      {category}
                    </Badge>
                  </div>
                )}

                {/* 제목 */}
                <CardTitle className="group-hover:text-primary mb-2 line-clamp-3 text-xl leading-tight transition-colors">
                  <h2>{title}</h2>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col space-y-2">
                {/* 요약 */}
                {summary && (
                  <p
                    className="text-muted-foreground line-clamp-3 text-sm leading-relaxed"
                    data-testid="post-summary"
                    aria-label={`게시물 요약: ${summary}`}
                  >
                    {summary}
                  </p>
                )}

                {/* 날짜와 태그 */}
                <div className="flex flex-wrap items-center gap-4">
                  {/* 날짜 */}
                  <time
                    className="text-muted-foreground/80 inline-flex items-center gap-1.5 text-xs font-medium"
                    dateTime={date}
                    aria-label={`게시일: ${formatDateToKorean(date)}`}
                  >
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="tracking-wide">{formatDateToKorean(date)}</span>
                  </time>

                  {/* 태그 */}
                  {tags && tags.length > 0 && (
                    <ul
                      className="flex flex-wrap gap-2"
                      data-testid="post-tags"
                      role="group"
                      aria-label="게시물 태그"
                    >
                      {tags.slice(0, 2).map((tag) => (
                        <li key={tag}>
                          <Badge variant="outline" className="text-xs" aria-label={`태그: ${tag}`}>
                            {tag}
                          </Badge>
                        </li>
                      ))}
                      {tags.length > 2 && (
                        <li>
                          <Badge
                            variant="secondary"
                            className="bg-muted/50 text-muted-foreground text-xs font-medium"
                            aria-label={`추가 태그 ${tags.length - 2}개`}
                          >
                            +{tags.length - 2}개
                          </Badge>
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </CardContent>
            </div>
          </div>
        </Link>
      </article>
    </Card>
  );
}
