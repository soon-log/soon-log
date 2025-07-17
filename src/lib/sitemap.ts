import { PostMetadata } from '@/types/mdx';

export function generateSitemap(posts: PostMetadata[], siteUrl: string): string {
  const staticPages = [
    {
      url: '/',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      url: '/search',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.7'
    }
  ];

  const postPages = posts.map((post) => ({
    url: `/post/${post.key}`,
    lastmod: post.date,
    changefreq: 'monthly',
    priority: '0.8'
  }));

  const allPages = [...staticPages, ...postPages];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return sitemapXml;
}
