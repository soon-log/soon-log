import fs from 'fs';
import path from 'path';

import { Metadata } from 'next';

import { PostLayout } from '@/app/(blog)/_components/post-layout';
import { PostMetadata } from '@/app/(blog)/_types/mdx';
import Giscus from '@/components/giscus';

import postsData from '../../../../../public/posts/posts.json';

export async function generateStaticParams() {
  const posts = Object.values(postsData).flat();
  return posts.map((post) => ({ key: post.key }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ key: string }>;
}): Promise<Metadata> {
  const { key } = await params;

  try {
    const { meta }: { meta: PostMetadata } = await import(`/posts/${key}/meta.ts`);

    const title = `${meta.title} | Soon Log`;
    const description = meta.summary;
    // 썸네일 이미지 처리
    const imageUrl = meta.thumbnail;

    return {
      title,
      description,
      robots: 'index, follow',
      openGraph: {
        title,
        description,
        images: [
          {
            url: imageUrl || '',
            width: 1200,
            height: 630,
            alt: meta.title
          }
        ]
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

export default async function PostNamePage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const { default: Post } = await import(`../../../../../posts/${key}/index.mdx`);
  const { meta } = await import(`../../../../../posts/${key}/meta.ts`);

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
      <div className="pt-4">
        <Giscus />
      </div>
    </PostLayout>
  );
}
