import { PostMetadata } from '@/app/(blog)/_types/mdx';
import { SEOMetadata } from '@/types/seo';

const SITE_NAME = 'Soon Log';
const DEFAULT_DESCRIPTION = 'Soon Log에서 개발 지식과 경험을 공유합니다.';
const DEFAULT_OG_IMAGE = '/default-og-image.jpg';

export function generateSEOMetadata(post: PostMetadata, siteUrl: string): SEOMetadata {
  const fullTitle = `${post.title} | ${SITE_NAME}`;
  const description = post.summary || DEFAULT_DESCRIPTION;
  const canonical = `${siteUrl}/post/${post.key}`;
  const image = post.thumbnail ? `${siteUrl}${post.thumbnail}` : `${siteUrl}${DEFAULT_OG_IMAGE}`;

  const publishedTime = new Date(post.date).toISOString();

  return {
    title: fullTitle,
    description,
    canonical,
    robots: 'index, follow',
    openGraph: {
      title: fullTitle,
      description,
      image,
      url: canonical,
      type: 'article',
      siteName: SITE_NAME,
      locale: 'ko_KR',
      publishedTime,
      tags: post.tags
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      image
    }
  };
}
