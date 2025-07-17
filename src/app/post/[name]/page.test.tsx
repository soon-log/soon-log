import { generateMetadata } from './page';

// Mock the meta import
jest.mock(
  '../../../../posts/test-post/meta.ts',
  () => ({
    meta: {
      key: 'test-post',
      title: 'Test Post Title',
      date: '2024-01-01',
      tags: ['JavaScript', 'React'],
      category: 'frontend',
      summary: 'This is a test post summary for SEO metadata generation.',
      thumbnail: '/posts/test-post/thumbnail.jpg'
    }
  }),
  { virtual: true }
);

describe('generateMetadata', () => {
  const mockParams = {
    params: Promise.resolve({ name: 'test-post' })
  };

  test('포스트 메타데이터로부터 Next.js 메타데이터를 생성한다', async () => {
    // Given & When
    const result = await generateMetadata(mockParams);

    // Then
    expect(result.title).toBe('Test Post Title | Soon Log');
    expect(result.description).toBe('This is a test post summary for SEO metadata generation.');
    expect(result.openGraph).toEqual({
      title: 'Test Post Title | Soon Log',
      description: 'This is a test post summary for SEO metadata generation.',
      images: [
        {
          url: '/posts/test-post/thumbnail.jpg',
          width: 1200,
          height: 630,
          alt: 'Test Post Title'
        }
      ],
      url: '/post/test-post',
      type: 'article',
      siteName: 'Soon Log',
      locale: 'ko_KR',
      publishedTime: '2024-01-01T00:00:00.000Z',
      tags: ['JavaScript', 'React']
    });
  });

  test('Twitter 메타데이터가 올바르게 생성된다', async () => {
    // Given & When
    const result = await generateMetadata(mockParams);

    // Then
    expect(result.twitter).toEqual({
      card: 'summary_large_image',
      title: 'Test Post Title | Soon Log',
      description: 'This is a test post summary for SEO metadata generation.',
      images: ['/posts/test-post/thumbnail.jpg']
    });
  });

  test('robots 메타데이터가 설정된다', async () => {
    // Given & When
    const result = await generateMetadata(mockParams);

    // Then
    expect(result.robots).toBe('index, follow');
  });

  test('canonical URL이 올바르게 설정된다', async () => {
    // Given & When
    const result = await generateMetadata(mockParams);

    // Then
    expect(result.alternates?.canonical).toBe('/post/test-post');
  });
});
