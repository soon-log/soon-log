import { PostMetadata } from '@/types/mdx';

import { generateSitemap } from './sitemap';

describe('generateSitemap', () => {
  const mockPosts: Array<PostMetadata> = [
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

  test('포스트 메타데이터로부터 XML sitemap을 생성한다', () => {
    // Given & When
    const result = generateSitemap(mockPosts, siteUrl);

    // Then
    expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(result).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(result).toContain('<url>');
    expect(result).toContain('<loc>https://soon-log.com/</loc>');
    expect(result).toContain('<loc>https://soon-log.com/post/javascript-fundamentals</loc>');
    expect(result).toContain('<loc>https://soon-log.com/post/react-hooks-guide</loc>');
    expect(result).toContain('<loc>https://soon-log.com/post/nodejs-backend-development</loc>');
    expect(result).toContain('</urlset>');
  });

  test('포스트 날짜가 lastmod에 포함된다', () => {
    // Given & When
    const result = generateSitemap(mockPosts, siteUrl);

    // Then
    expect(result).toContain('<lastmod>2024-01-15</lastmod>');
    expect(result).toContain('<lastmod>2024-01-20</lastmod>');
    expect(result).toContain('<lastmod>2024-01-10</lastmod>');
  });

  test('포스트 우선순위가 올바르게 설정된다', () => {
    // Given & When
    const result = generateSitemap(mockPosts, siteUrl);

    // Then
    // 메인 페이지는 1.0 우선순위
    expect(result).toContain('<priority>1.0</priority>');
    // 포스트 페이지는 0.8 우선순위
    expect(result).toContain('<priority>0.8</priority>');
  });

  test('변경 빈도가 올바르게 설정된다', () => {
    // Given & When
    const result = generateSitemap(mockPosts, siteUrl);

    // Then
    // 메인 페이지는 daily
    expect(result).toContain('<changefreq>daily</changefreq>');
    // 포스트 페이지는 monthly
    expect(result).toContain('<changefreq>monthly</changefreq>');
  });

  test('빈 포스트 배열로도 sitemap을 생성할 수 있다', () => {
    // Given & When
    const result = generateSitemap([], siteUrl);

    // Then
    expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(result).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(result).toContain('<loc>https://soon-log.com/</loc>');
    expect(result).toContain('</urlset>');
  });

  test('검색 페이지와 기본 페이지들이 포함된다', () => {
    // Given & When
    const result = generateSitemap(mockPosts, siteUrl);

    // Then
    expect(result).toContain('<loc>https://soon-log.com/search</loc>');
  });
});
