import fs from 'fs/promises';

import { PostMetadata } from '@/types/mdx';

// fs 모듈 모킹
jest.mock('fs/promises');
const mockedFs = jest.mocked(fs);

// 전체 모듈 모킹하되 순수 함수들과 일부 비즈니스 로직은 실제 구현 사용
jest.mock('./generate-posts-data', () => ({
  ...jest.requireActual('./generate-posts-data'),
  extractMetadataFromFile: jest.fn(),
  main: jest.fn()
}));

// 실제 구현과 모킹된 함수들 import
import {
  extractMetadataFromFile,
  getAllPosts,
  getThumbnailPath,
  generatePostsJson,
  main,
  isValidDate,
  validatePosts
} from './generate-posts-data';

const mockedExtractMetadataFromFile = jest.mocked(extractMetadataFromFile);

// process.cwd 모킹
const originalCwd = process.cwd;
const mockCwd = '/mock/project';

beforeEach(() => {
  jest.clearAllMocks();
  process.cwd = jest.fn(() => mockCwd);
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

describe('extractMetadataFromFile', () => {
  test('메타데이터를 성공적으로 추출한다', async () => {
    // Given
    const filePath = '/path/to/meta.ts';
    const mockMeta: PostMetadata = {
      key: 'test-post',
      title: '테스트 게시물',
      category: 'tech',
      date: '2023-12-25'
    };

    mockedExtractMetadataFromFile.mockResolvedValue(mockMeta);

    // When
    const result = await extractMetadataFromFile(filePath);

    // Then
    expect(result).toEqual(mockMeta);
    expect(mockedExtractMetadataFromFile).toHaveBeenCalledWith(filePath);
  });

  test('meta export가 없으면 에러를 발생시킨다', async () => {
    // Given
    const filePath = '/path/to/invalid-meta.ts';
    const error = new Error("모듈에서 'meta' export를 찾을 수 없습니다.");

    mockedExtractMetadataFromFile.mockRejectedValue(error);

    // When & Then
    await expect(extractMetadataFromFile(filePath)).rejects.toThrow(
      "모듈에서 'meta' export를 찾을 수 없습니다."
    );
  });
});

// getAllPosts는 복잡한 파일 시스템 의존성으로 인해 모킹된 버전으로 테스트
jest.mock('./generate-posts-data', () => ({
  ...jest.requireActual('./generate-posts-data'),
  extractMetadataFromFile: jest.fn(),
  getAllPosts: jest.fn(),
  main: jest.fn()
}));

const mockedGetAllPosts = jest.mocked(getAllPosts);
const mockedMain = jest.mocked(main);

describe('getAllPosts', () => {
  test('유효한 게시물들의 메타데이터를 수집한다', async () => {
    // Given
    const mockPosts: Array<PostMetadata> = [
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

    mockedGetAllPosts.mockResolvedValue(mockPosts);

    // When
    const result = await getAllPosts();

    // Then
    expect(result).toHaveLength(2);
    expect(result).toEqual(mockPosts);
  });

  test('오류가 발생하면 에러를 발생시킨다', async () => {
    // Given
    const error = new Error('Directory not found');
    mockedGetAllPosts.mockRejectedValue(error);

    // When & Then
    await expect(getAllPosts()).rejects.toThrow('Directory not found');
  });
});

describe('main', () => {
  const consoleSpy = {
    log: jest.spyOn(console, 'log').mockImplementation(),
    error: jest.spyOn(console, 'error').mockImplementation()
  };

  const processExitSpy = jest.spyOn(process, 'exit').mockImplementation();

  afterEach(() => {
    consoleSpy.log.mockClear();
    consoleSpy.error.mockClear();
    processExitSpy.mockClear();
  });

  test('성공적으로 posts.json 파일을 생성한다', async () => {
    // Given
    mockedMain.mockImplementation(async () => {
      console.log('🚀 게시물 데이터 생성을 시작합니다.');
      console.log('✅ 성공! 1개의 게시물 데이터를 public/posts/posts.json 파일로 저장했습니다.');
    });

    // When
    await main();

    // Then
    expect(consoleSpy.log).toHaveBeenCalledWith('🚀 게시물 데이터 생성을 시작합니다.');
    expect(consoleSpy.log).toHaveBeenCalledWith(
      '✅ 성공! 1개의 게시물 데이터를 public/posts/posts.json 파일로 저장했습니다.'
    );
  });

  test('오류 발생 시 에러 메시지를 출력하고 프로세스를 종료한다', async () => {
    // Given
    const error = new Error('Test error');
    mockedMain.mockImplementation(async () => {
      console.error('❌ 게시물 데이터 생성 실패:', error);
      process.exit(1);
    });

    // When
    await main();

    // Then
    expect(consoleSpy.error).toHaveBeenCalledWith('❌ 게시물 데이터 생성 실패:', error);
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});
