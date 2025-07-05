import fs from 'fs/promises';

import { PostMetadata } from '@/types/mdx';

// fs 모듈 모킹
jest.mock('fs/promises');
const mockedFs = jest.mocked(fs);

// generate-posts-data 모듈에서 extractMetadataFromFile 함수만 모킹
jest.mock('./generate-posts-data', () => {
  const actualModule = jest.requireActual('./generate-posts-data');
  return {
    ...actualModule,
    extractMetadataFromFile: jest.fn()
    // main 함수에서 사용하는 다른 함수들은 필요시 개별 테스트에서 모킹
  };
});

// 실제 구현과 모킹된 함수들 import
import {
  getThumbnailPath,
  generatePostsJson,
  isValidDate,
  validatePosts,
  getAllPosts,
  main
} from './generate-posts-data';

// process.cwd 모킹
const originalCwd = process.cwd;
const mockCwd = '/mock/project';

beforeEach(() => {
  jest.clearAllMocks();
  process.cwd = jest.fn(() => mockCwd);

  // console 출력 모킹 (테스트 출력을 깔끔하게 하기 위함)
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  process.cwd = originalCwd;
});

describe('isValidDate', () => {
  test('올바른 날짜 형식이면 true를 반환한다', () => {
    // Given
    const validDate = '2023-12-25';

    // When
    const result = isValidDate(validDate);

    // Then
    expect(result).toBe(true);
  });

  test('잘못된 날짜 형식이면 false를 반환한다', () => {
    // Given
    const invalidFormats = [
      '2023/12/25',
      '25-12-2023',
      '2023-12-25T10:30:00',
      '2023-12',
      '12-25',
      'invalid-date'
    ];

    // When & Then
    invalidFormats.forEach((date) => {
      expect(isValidDate(date)).toBe(false);
    });
  });

  test('존재하지 않는 날짜면 false를 반환한다', () => {
    // Given
    const invalidDates = [
      '2023-02-30', // 2월 30일
      '2023-13-01', // 13월
      '2023-04-31' // 4월 31일
    ];

    // When & Then
    invalidDates.forEach((date) => {
      expect(isValidDate(date)).toBe(false);
    });
  });
});

describe('validatePosts', () => {
  test('유효한 게시물들을 필터링하여 반환한다', () => {
    // Given
    const posts: Array<PostMetadata> = [
      {
        key: 'post1',
        title: '게시물 1',
        category: 'tech',
        date: '2023-12-25'
      },
      {
        key: 'post2',
        title: '게시물 2',
        category: 'blog',
        date: '2023-12-24'
      }
    ];

    // When
    const result = validatePosts(posts);

    // Then
    expect(result).toHaveLength(2);
    expect(result).toEqual(posts);
  });

  test('필수 필드가 누락된 게시물을 제외한다', () => {
    // Given
    const posts = [
      {
        key: 'post1',
        title: '게시물 1',
        category: 'tech',
        date: '2023-12-25'
      },
      {
        // key 누락
        title: '게시물 2',
        category: 'blog',
        date: '2023-12-24'
      },
      {
        key: 'post3',
        // title 누락
        category: 'tech',
        date: '2023-12-23'
      }
    ];

    // When
    const result = validatePosts(posts as Array<any>);

    // Then
    expect(result).toHaveLength(1);
    expect(result[0]?.key).toBe('post1');
  });

  test('잘못된 날짜 형식의 게시물을 제외한다', () => {
    // Given
    const posts = [
      {
        key: 'post1',
        title: '게시물 1',
        category: 'tech',
        date: '2023-12-25'
      },
      {
        key: 'post2',
        title: '게시물 2',
        category: 'blog',
        date: '2023/12/24' // 잘못된 형식
      },
      {
        key: 'post3',
        title: '게시물 3',
        category: 'tech',
        date: '2023-02-30' // 존재하지 않는 날짜
      }
    ] as Array<PostMetadata>;

    // When
    const result = validatePosts(posts);

    // Then
    expect(result).toHaveLength(1);
    expect(result[0]?.key).toBe('post1');
  });
});

describe('generatePostsJson', () => {
  beforeEach(() => {
    // fs.access 모킹 (파일 존재 여부 확인)
    mockedFs.access.mockImplementation(async (path) => {
      if (path.toString().includes('post1/thumbnail.jpg')) {
        return Promise.resolve();
      }
      if (path.toString().includes('post2/thumbnail.png')) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('File not found'));
    });
  });

  test('게시물들을 카테고리별로 그룹화하고 날짜순으로 정렬한다', async () => {
    // Given
    const posts: Array<PostMetadata> = [
      {
        key: 'post1',
        title: '게시물 1',
        category: 'tech',
        date: '2023-12-23'
      },
      {
        key: 'post2',
        title: '게시물 2',
        category: 'blog',
        date: '2023-12-25'
      },
      {
        key: 'post3',
        title: '게시물 3',
        category: 'tech',
        date: '2023-12-24'
      }
    ];

    // When
    const result = await generatePostsJson(posts);

    // Then
    expect(result).toHaveProperty('tech');
    expect(result).toHaveProperty('blog');
    expect(result.tech!).toHaveLength(2);
    expect(result.blog!).toHaveLength(1);

    // 날짜 역순으로 정렬되어야 함
    expect(result.tech![0]?.date).toBe('2023-12-24');
    expect(result.tech![1]?.date).toBe('2023-12-23');
    expect(result.blog![0]?.date).toBe('2023-12-25');
  });

  test('카테고리가 없는 게시물을 기타로 분류한다', async () => {
    // Given
    const posts = [
      {
        key: 'post1',
        title: '게시물 1',
        date: '2023-12-25'
      }
    ] as Array<PostMetadata>;

    // When
    const result = await generatePostsJson(posts);

    // Then
    expect(result).toHaveProperty('기타');
    expect(result.기타!).toHaveLength(1);
    expect(result.기타![0]).toMatchObject({
      key: 'post1',
      title: '게시물 1',
      date: '2023-12-25'
    });
  });
});

describe('getThumbnailPath', () => {
  test('썸네일 이미지가 있으면 경로를 반환한다', async () => {
    // Given
    const postKey = 'test-post';
    mockedFs.readdir.mockResolvedValue(['thumbnail.jpg', 'index.mdx'] as any);

    // When
    const result = await getThumbnailPath(postKey);

    // Then
    expect(result).toBe('/posts/test-post/thumbnail.jpg');
  });

  test('썸네일 이미지가 없으면 null을 반환한다', async () => {
    // Given
    const postKey = 'test-post';
    mockedFs.readdir.mockRejectedValue(new Error('Directory not found'));

    // When
    const result = await getThumbnailPath(postKey);

    // Then
    expect(result).toBe(null);
  });

  test('썸네일 파일이 없으면 null을 반환한다', async () => {
    // Given
    const postKey = 'test-post';
    mockedFs.readdir.mockResolvedValue(['index.mdx', 'meta.ts'] as any);

    // When
    const result = await getThumbnailPath(postKey);

    // Then
    expect(result).toBe(null);
  });
});
describe('getAllPosts', () => {
  test('posts 디렉토리 읽기 실패 시 에러를 발생시킨다', async () => {
    // Given
    const mockError = new Error('Directory read failed');
    mockedFs.readdir.mockRejectedValue(mockError);

    // When & Then
    await expect(getAllPosts()).rejects.toThrow('Directory read failed');
    expect(mockedFs.readdir).toHaveBeenCalledWith(`${mockCwd}/posts`, { withFileTypes: true });
  });

  test('빈 디렉토리에서 빈 배열을 반환한다', async () => {
    // Given
    mockedFs.readdir.mockResolvedValue([] as any);

    // When
    const result = await getAllPosts();

    // Then
    expect(result).toEqual([]);
    expect(mockedFs.readdir).toHaveBeenCalledWith(`${mockCwd}/posts`, { withFileTypes: true });
  });

  test('디렉토리가 아닌 파일들을 제외한다', async () => {
    // Given
    const mockDirents = [
      { name: 'file1.txt', isDirectory: () => false },
      { name: 'file2.md', isDirectory: () => false }
    ];
    mockedFs.readdir.mockResolvedValue(mockDirents as any);

    // When
    const result = await getAllPosts();

    // Then
    expect(result).toEqual([]);
  });
});

describe('main', () => {
  // process.exit 모킹
  const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation((() => {}) as any);

  beforeEach(() => {
    mockProcessExit.mockClear();
    // fs.mkdir과 fs.writeFile 모킹
    mockedFs.mkdir.mockResolvedValue(undefined);
    mockedFs.writeFile.mockResolvedValue(undefined);
    // fs.readdir 모킹 (getAllPosts에서 사용)
    mockedFs.readdir.mockResolvedValue([]);
  });

  test('성공적으로 posts.json 파일을 생성한다', async () => {
    // Given - 빈 posts 디렉토리 시나리오 (실제 파일 시스템 동작 확인)
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    // When
    await main();

    // Then
    expect(consoleSpy).toHaveBeenCalledWith('🚀 게시물 데이터 생성을 시작합니다.');
    expect(consoleSpy).toHaveBeenCalledWith(
      '✅ 성공! 0개의 게시물 데이터를 public/posts/posts.json 파일로 저장했습니다.'
    );
    expect(mockedFs.mkdir).toHaveBeenCalledWith(`${mockCwd}/public/posts`, { recursive: true });
    expect(mockedFs.writeFile).toHaveBeenCalledWith(
      `${mockCwd}/public/posts/posts.json`,
      JSON.stringify({}, null, 2)
    );
    expect(mockProcessExit).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  test('오류 발생 시 에러 메시지를 출력하고 프로세스를 종료한다', async () => {
    // Given
    const testError = new Error('Directory read failed');
    mockedFs.readdir.mockRejectedValue(testError);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // When
    await main();

    // Then
    expect(consoleErrorSpy).toHaveBeenCalledWith('❌ 게시물 데이터 생성 실패:', testError);
    expect(mockProcessExit).toHaveBeenCalledWith(1);

    consoleErrorSpy.mockRestore();
  });
});
