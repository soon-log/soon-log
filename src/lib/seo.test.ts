import { PostMetadata } from '@/types/mdx';

import { generateSEOMetadata } from './seo';

describe('generateSEOMetadata', () => {
  const mockPost: PostMetadata = {
    key: 'test-post',
    title: 'Test Post Title',
    date: '2024-01-01',
    tags: ['JavaScript', 'React'],
    category: 'frontend',
    summary: 'This is a test post summary for SEO metadata generation.',
    thumbnail: '/posts/test-post/thumbnail.jpg'
  };

  const siteUrl = 'https://soon-log.com';

  test('포스트 메타데이터로부터 SEO 메타데이터를 생성한다', () => {
    // Given & When
    const result = generateSEOMetadata(mockPost, siteUrl);

    // Then
    expect(result.title).toBe('Test Post Title | Soon Log');
    expect(result.description).toBe('This is a test post summary for SEO metadata generation.');
    expect(result.canonical).toBe(`${siteUrl}/post/${mockPost.key}`);
    expect(result.openGraph.title).toBe('Test Post Title | Soon Log');
    expect(result.openGraph.description).toBe(
      'This is a test post summary for SEO metadata generation.'
    );
    expect(result.openGraph.url).toBe(`${siteUrl}/post/${mockPost.key}`);
    expect(result.openGraph.type).toBe('article');
    expect(result.openGraph.siteName).toBe('Soon Log');
    expect(result.openGraph.locale).toBe('ko_KR');
    expect(result.openGraph.publishedTime).toBe('2024-01-01T00:00:00.000Z');
    expect(result.openGraph.tags).toEqual(['JavaScript', 'React']);
  });

  test('썸네일이 있는 경우 Open Graph 이미지를 포함한다', () => {
    // Given & When
    const result = generateSEOMetadata(mockPost, siteUrl);

    // Then
    expect(result.openGraph.image).toBe(`${siteUrl}/posts/test-post/thumbnail.jpg`);
    expect(result.twitter.image).toBe(`${siteUrl}/posts/test-post/thumbnail.jpg`);
  });

  test('썸네일이 없는 경우 기본 이미지를 사용한다', () => {
    // Given
    const postWithoutThumbnail: PostMetadata = {
      ...mockPost,
      thumbnail: null
    };

    // When
    const result = generateSEOMetadata(postWithoutThumbnail, siteUrl);

    // Then
    expect(result.openGraph.image).toBe(`${siteUrl}/default-og-image.jpg`);
    expect(result.twitter.image).toBe(`${siteUrl}/default-og-image.jpg`);
  });

  test('요약이 없는 경우 기본 설명을 사용한다', () => {
    // Given
    const postWithoutSummary: PostMetadata = {
      ...mockPost,
      summary: undefined
    };

    // When
    const result = generateSEOMetadata(postWithoutSummary, siteUrl);

    // Then
    expect(result.description).toBe('Soon Log에서 개발 지식과 경험을 공유합니다.');
    expect(result.openGraph.description).toBe('Soon Log에서 개발 지식과 경험을 공유합니다.');
    expect(result.twitter.description).toBe('Soon Log에서 개발 지식과 경험을 공유합니다.');
  });

  test('Twitter 메타데이터가 올바르게 생성된다', () => {
    // Given & When
    const result = generateSEOMetadata(mockPost, siteUrl);

    // Then
    expect(result.twitter.card).toBe('summary_large_image');
    expect(result.twitter.title).toBe('Test Post Title | Soon Log');
    expect(result.twitter.description).toBe(
      'This is a test post summary for SEO metadata generation.'
    );
  });

  test('robots 메타데이터가 기본값으로 설정된다', () => {
    // Given & When
    const result = generateSEOMetadata(mockPost, siteUrl);

    // Then
    expect(result.robots).toBe('index, follow');
  });
});
