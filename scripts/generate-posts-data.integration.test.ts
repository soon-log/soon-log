import fs from 'fs/promises';
import os from 'os';
import path from 'path';

import { PostMetadata } from '@/app/(blog)/_types/mdx';

import { extractMetadataFromFile } from './generate-posts-data';

describe('extractMetadataFromFile', () => {
  let tempDir: string;

  beforeAll(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'metadata-test-'));
  });

  afterAll(async () => {
    if (tempDir) {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });

  beforeEach(() => {
    // 테스트 중 console.error 출력 억제
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // console.error 모킹 해제
    jest.restoreAllMocks();
  });

  test('유효한 파일에서 메타데이터를 추출한다', async () => {
    // Given
    const filePath = path.join(tempDir, 'valid.ts');
    const mockMeta: PostMetadata = {
      key: 'test',
      title: 'title',
      category: 'cat',
      date: '2025-07-07'
    };
    await fs.writeFile(filePath, `export const meta = ${JSON.stringify(mockMeta)}`);

    // When
    const result = await extractMetadataFromFile(filePath);

    // Then
    expect(result).toEqual(mockMeta);
  });

  test('meta export가 없으면 에러를 던진다', async () => {
    // Given
    const filePath = path.join(tempDir, 'invalid.ts');
    await fs.writeFile(filePath, `export const data = {}`);

    // When & Then
    await expect(extractMetadataFromFile(filePath)).rejects.toThrow(
      "모듈에서 'meta' export를 찾을 수 없습니다."
    );
  });
});
