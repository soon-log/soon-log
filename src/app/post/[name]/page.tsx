import fs from 'fs';
import path from 'path';

import { Metadata } from 'next';

import PostLayout from '@/components/post-layout';
import { PostMetadata } from '@/types/mdx';

export async function generateMetadata({
  params
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;

  try {
    // 포스트 메타데이터 동적 import
    const { meta }: { meta: PostMetadata } = await import(`../../../../posts/${name}/meta.ts`);

    const fullTitle = `${meta.title} | Soon Log`;
    const description = meta.summary || 'Soon Log에서 개발 지식과 경험을 공유합니다.';
    const canonical = `/post/${meta.key}`;
    const publishedTime = new Date(meta.date).toISOString();

    // 썸네일 이미지 처리
    const imageUrl = meta.thumbnail || '/default-og-image.jpg';

    return {
      title: fullTitle,
      description,
      robots: 'index, follow',
      alternates: {
        canonical
      },
      openGraph: {
        title: fullTitle,
        description,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: meta.title
          }
        ],
        url: canonical,
        type: 'article',
        siteName: 'Soon Log',
        locale: 'ko_KR',
        publishedTime,
        tags: meta.tags
      },
      twitter: {
        card: 'summary_large_image',
        title: fullTitle,
        description,
        images: [imageUrl]
      }
    };
  } catch (error) {
    console.error(`포스트 메타데이터 로드 실패: ${name}`, error);

    return {
      title: 'Soon Log',
      description: '포스트를 찾을 수 없습니다.',
      robots: 'noindex, nofollow'
    };
  }
}

export default async function PostNamePage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const { default: Post } = await import(`../../../../posts/${name}/index.mdx`);
  const { meta } = await import(`../../../../posts/${name}/meta.ts`);

  const thumbnailDir = path.join(process.cwd(), 'public', 'posts', meta.key);
  try {
    const files = fs.readdirSync(thumbnailDir);
    const thumbnailFile = files.find((file) => file.startsWith('thumbnail.'));
    if (thumbnailFile) {
      meta.thumbnail = `/posts/${meta.key}/${thumbnailFile}`;
    }
  } catch {
    // 썸네일 디렉토리가 없는 경우 무시
  }

  return (
    <PostLayout meta={meta}>
      <Post />
    </PostLayout>
  );
}
