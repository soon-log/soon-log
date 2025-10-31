import Image from 'next/image';
import Link from 'next/link';

import { PostMetadata } from '@/entities/post';
import { DateViewer, CondensedTagList } from '@/shared/components';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface PostCardProps {
  post: PostMetadata;
}

export function PostCard({ post }: PostCardProps) {
  const { key, title, date, tags, category, summary, thumbnail } = post;

  return (
    <Card className="p-0 transition-all duration-300 hover:shadow-md hover:shadow-black/5">
      <article>
        <Link
          href={`/post/${key}`}
          className="focus-visible:ring-primary block overflow-hidden rounded-xl py-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          aria-label={`${title} 게시물 읽기`}
        >
          <div className="flex h-full flex-col items-center md:flex-row">
            {/* 썸네일 영역 - 모바일: 상단, 데스크톱: 좌측 */}
            {thumbnail && (
              <div className="relative aspect-[4/3] w-full overflow-hidden border-t-1 border-b-1 md:ml-6 md:aspect-[3/4] md:w-24 md:flex-shrink-0 md:rounded-md md:border-1">
                <Image
                  src={thumbnail}
                  alt={`${title} 썸네일 이미지`}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
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
            <div className="mt-4 flex min-h-0 flex-1 flex-col gap-2 md:mt-0 md:gap-3">
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
                <CardTitle className="group-hover:text-primary line-clamp-3 text-xl leading-tight transition-colors">
                  <h2>{title}</h2>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col gap-2 md:gap-3">
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
                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                  {/* 날짜 */}
                  <DateViewer date={date} />

                  {/* 태그 */}
                  <CondensedTagList tags={tags || []} />
                </div>
              </CardContent>
            </div>
          </div>
        </Link>
      </article>
    </Card>
  );
}
