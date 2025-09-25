import { PostMetadata } from '@/app/(blog)/_types/mdx';

// XML 특수 문자 이스케이프 함수
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function generateRSSFeed(posts: Array<PostMetadata>, siteUrl: string): string {
  const siteName = 'Soon Log';
  const siteDescription = '개발 지식과 경험을 공유하는 기술 블로그';

  // 포스트를 날짜 기준으로 최신순 정렬하고 최대 20개만 선택
  const sortedPosts = posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toUTCString();
  };

  const rssItems = sortedPosts
    .map((post) => {
      const postUrl = `${siteUrl}/post/${post.key}`;
      const pubDate = formatDate(post.date);
      const description = post.summary || '';

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <description>${escapeXml(description)}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(post.category || '')}</category>
      <guid>${postUrl}</guid>
    </item>`;
    })
    .join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>ko-KR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <managingEditor>noreply@soon-log.com (Soon Log)</managingEditor>
    <webMaster>noreply@soon-log.com (Soon Log)</webMaster>
${rssItems}
  </channel>
</rss>`;

  return rssXml;
}
