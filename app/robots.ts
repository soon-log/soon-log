import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/webtoon/'
    },
    sitemap: 'https://soon-log.vercel.app/sitemap.xml'
  };
}
