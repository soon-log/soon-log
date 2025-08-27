import { generateRSSFeed } from '@/lib/rss';
import { PostMetadata } from '@/types/mdx';

describe('generateRSSFeed', () => {
  const mockPosts: PostMetadata[] = [
    {
      key: 'javascript-fundamentals',
      title: 'JavaScript 기초',
      date: '2024-01-15',
      tags: ['JavaScript', 'Frontend'],
      category: 'frontend',
      summary: 'JavaScript 기초 개념을 알아봅시다.'
    },
    {
      key: 'react-hooks-guide',
      title: 'React Hooks 가이드',
      date: '2024-01-20',
      tags: ['React', 'Hooks'],
      category: 'frontend',
      summary: 'React Hooks 사용법을 익혀봅시다.'
    },
    {
      key: 'nodejs-backend-development',
      title: 'Node.js 백엔드 개발',
      date: '2024-01-10',
      tags: ['Node.js', 'Backend'],
      category: 'backend',
      summary: 'Node.js로 백엔드 개발을 시작해봅시다.'
    }
  ];

  const siteUrl = 'https://soon-log.com';

  test('포스트 메타데이터로부터 RSS 피드를 생성한다', () => {
    // Given & When
    const result = generateRSSFeed(mockPosts, siteUrl);

    // Then
    expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(result).toContain('<rss version="2.0">');
    expect(result).toContain('<channel>');
    expect(result).toContain('<title>Soon Log</title>');
    expect(result).toContain('<description>개발 지식과 경험을 공유하는 기술 블로그</description>');
    expect(result).toContain('<link>https://soon-log.com</link>');
    expect(result).toContain('<item>');
    expect(result).toContain('<title>JavaScript 기초</title>');
    expect(result).toContain('<title>React Hooks 가이드</title>');
    expect(result).toContain('<title>Node.js 백엔드 개발</title>');
    expect(result).toContain('</channel>');
    expect(result).toContain('</rss>');
  });

  test('포스트가 최신순으로 정렬되어 RSS 피드에 포함된다', () => {
    // Given & When
    const result = generateRSSFeed(mockPosts, siteUrl);

    // Then
    const reactHooksIndex = result.indexOf('<title>React Hooks 가이드</title>');
    const javascriptIndex = result.indexOf('<title>JavaScript 기초</title>');
    const nodejsIndex = result.indexOf('<title>Node.js 백엔드 개발</title>');

    // React Hooks (2024-01-20)가 가장 먼저 나와야 함
    expect(reactHooksIndex).toBeLessThan(javascriptIndex);
    expect(javascriptIndex).toBeLessThan(nodejsIndex);
  });

  test('포스트 링크가 올바르게 설정된다', () => {
    // Given & When
    const result = generateRSSFeed(mockPosts, siteUrl);

    // Then
    expect(result).toContain('<link>https://soon-log.com/post/javascript-fundamentals</link>');
    expect(result).toContain('<link>https://soon-log.com/post/react-hooks-guide</link>');
    expect(result).toContain('<link>https://soon-log.com/post/nodejs-backend-development</link>');
  });

  test('포스트 요약이 description에 포함된다', () => {
    // Given & When
    const result = generateRSSFeed(mockPosts, siteUrl);

    // Then
    expect(result).toContain('<description>JavaScript 기초 개념을 알아봅시다.</description>');
    expect(result).toContain('<description>React Hooks 사용법을 익혀봅시다.</description>');
    expect(result).toContain('<description>Node.js로 백엔드 개발을 시작해봅시다.</description>');
  });

  test('포스트 날짜가 pubDate에 포함된다', () => {
    // Given & When
    const result = generateRSSFeed(mockPosts, siteUrl);

    // Then
    expect(result).toContain('<pubDate>Mon, 15 Jan 2024 00:00:00 GMT</pubDate>');
    expect(result).toContain('<pubDate>Sat, 20 Jan 2024 00:00:00 GMT</pubDate>');
    expect(result).toContain('<pubDate>Wed, 10 Jan 2024 00:00:00 GMT</pubDate>');
  });

  test('포스트 카테고리가 category에 포함된다', () => {
    // Given & When
    const result = generateRSSFeed(mockPosts, siteUrl);

    // Then
    expect(result).toContain('<category>frontend</category>');
    expect(result).toContain('<category>backend</category>');
  });

  test('빈 포스트 배열로도 RSS 피드를 생성할 수 있다', () => {
    // Given & When
    const result = generateRSSFeed([], siteUrl);

    // Then
    expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(result).toContain('<rss version="2.0">');
    expect(result).toContain('<channel>');
    expect(result).toContain('<title>Soon Log</title>');
    expect(result).toContain('</channel>');
    expect(result).toContain('</rss>');
  });

  test('최대 20개의 포스트만 RSS 피드에 포함된다', () => {
    // Given
    const manyPosts = Array.from({ length: 25 }, (_, i) => ({
      key: `post-${i}`,
      title: `Post ${i}`,
      date: `2024-01-${String(i + 1).padStart(2, '0')}`,
      tags: ['tag'],
      category: 'category',
      summary: `Summary ${i}`
    }));

    // When
    const result = generateRSSFeed(manyPosts, siteUrl);

    // Then
    const itemCount = (result.match(/<item>/g) || []).length;
    expect(itemCount).toBe(20);
  });

  test('XML 특수 문자를 올바르게 이스케이프한다', () => {
    // Given
    const postsWithSpecialChars: Array<PostMetadata> = [
      {
        key: 'special-chars-post',
        title: 'HTML & CSS <guide> "for" beginners',
        date: '2024-01-15',
        tags: ['HTML'],
        category: 'frontend',
        summary: 'Learn HTML & CSS with <tags> & "quotes" today!'
      }
    ];

    // When
    const result = generateRSSFeed(postsWithSpecialChars, siteUrl);

    // Then
    // 특수 문자가 이스케이프되어야 함
    expect(result).toContain(
      '<title>HTML &amp; CSS &lt;guide&gt; &quot;for&quot; beginners</title>'
    );
    expect(result).toContain(
      '<description>Learn HTML &amp; CSS with &lt;tags&gt; &amp; &quot;quotes&quot; today!</description>'
    );

    // 원본 특수 문자가 그대로 있으면 안 됨
    expect(result).not.toContain('<title>HTML & CSS <guide> "for" beginners</title>');
    expect(result).not.toContain(
      '<description>Learn HTML & CSS with <tags> & "quotes" today!</description>'
    );
  });
});
