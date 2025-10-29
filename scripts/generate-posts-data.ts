import fs from 'fs/promises';
import path from 'path';

import { PostMetadata } from '@/entities/post';

/**
 * meta.ts 파일에서 메타데이터를 추출합니다.
 * @param filePath - 메타데이터를 추출할 파일의 경로
 * @returns 메타데이터
 */
export async function extractMetadataFromFile(filePath: string): Promise<PostMetadata> {
  try {
    const metaPath = `file://${filePath}`;
    const metaModule = await import(metaPath);

    if (!metaModule.meta) {
      throw new Error("모듈에서 'meta' export를 찾을 수 없습니다.");
    }

    return metaModule.meta;
  } catch (error) {
    console.error(`[오류] ${filePath}에서 메타데이터 추출 실패:`, error);
    throw error;
  }
}

/**
 * posts 디렉토리에서 모든 게시물의 메타데이터를 수집합니다.
 * @returns 모든 게시물의 메타데이터
 */
export async function getAllPosts(): Promise<Array<PostMetadata>> {
  const postsDir = path.join(process.cwd(), 'posts');

  try {
    const postFolders = await fs.readdir(postsDir, { withFileTypes: true });
    const postDirs = postFolders
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    const postPromises = postDirs.map(async (postDir) => {
      const postPath = path.join(postsDir, postDir);
      const metaPath = path.join(postPath, 'meta.ts');
      const mdxPath = path.join(postPath, 'index.mdx');

      try {
        await fs.access(metaPath);
        await fs.access(mdxPath);
      } catch {
        console.warn(`[경고] ${postDir}에 meta.ts 또는 index.mdx 파일이 없습니다.`);
        return null;
      }

      try {
        return await extractMetadataFromFile(metaPath);
      } catch (error) {
        console.error(`[오류] ${postDir} 처리 중 오류가 발생하여 해당 게시물을 제외합니다.`, error);
        return null;
      }
    });

    const metadataPromises = await Promise.all(postPromises);
    return metadataPromises.filter((metadata) => metadata !== null);
  } catch (error) {
    console.error('[오류] posts 디렉토리 읽기 실패:', error);
    throw error;
  }
}

/**
 * 게시물들을 카테고리별로 그룹화하고 날짜순으로 정렬합니다
 * @param posts - 게시물들
 * @returns 카테고리별 그룹화된 게시물들
 */
export async function generatePostsJson(
  posts: Array<PostMetadata>
): Promise<Record<string, Array<PostMetadata>>> {
  const groupedByCategory: Record<string, Array<PostMetadata>> = {};

  for (const post of posts) {
    const category = post.category || '기타';
    if (!groupedByCategory[category]) {
      groupedByCategory[category] = [];
    }
    post.thumbnail = await getThumbnailPath(post.key);
    groupedByCategory[category].push(post);
  }

  for (const category in groupedByCategory) {
    groupedByCategory[category]?.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime(); // 날짜 내림차순
    });
  }

  return groupedByCategory;
}

/**
 * 게시물의 썸네일 이미지가 존재하는지 확인한다.
 * 존재하면 썸네일 이미지 경로를 아니면 null을 반환한다.
 * @param key - 게시물 키
 * @returns 썸네일 이미지 경로 또는 null
 */
export async function getThumbnailPath(key: string): Promise<string | null> {
  const supportedExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif'];
  const postAssetDir = path.join(process.cwd(), 'public', 'posts', key);

  try {
    const files = await fs.readdir(postAssetDir);
    const thumbnailFile = files.find(
      (file) =>
        file.startsWith('thumbnail.') && supportedExtensions.includes(file.split('.').pop() ?? '')
    );

    if (thumbnailFile) {
      return `/posts/${key}/${thumbnailFile}`; // 찾은 파일로 URL 경로 반환
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * 날짜 문자열이 유효한지 검증합니다
 * @param dateString - 날짜 문자열
 * @returns 날짜 문자열이 유효한지 여부
 */
export function isValidDate(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;

  const date = new Date(dateString);

  // getTime()이 NaN이면 유효하지 않은 날짜 (e.g., '2023-02-30')
  if (isNaN(date.getTime())) return false;

  return date.toISOString().slice(0, 10) === dateString;
}

/**
 * 게시물 메타데이터를 검증한다.
 * @param posts - 게시물 메타데이터 배열
 * @returns 검증된 게시물 메타데이터 배열
 */
export function validatePosts(posts: Array<PostMetadata>): Array<PostMetadata> {
  return posts.filter((post) => {
    const requiredFields: Array<keyof PostMetadata> = ['key', 'title', 'category', 'date'];
    const missingField = requiredFields.find((field) => !post[field]);
    if (missingField) {
      return false;
    }

    if (!isValidDate(post.date)) {
      return false;
    }

    return true;
  });
}

/**
 * 메인 실행 함수
 * 게시물 메타데이터를 수집하고, 유효성 검증을 수행한 후, 카테고리별로 그룹화하고 날짜순으로 정렬하여 posts.json 파일을 생성한다.
 */
export async function main() {
  try {
    console.log('🚀 게시물 데이터 생성을 시작합니다.');
    // 1. 모든 게시물 메타데이터 수집
    const posts = await getAllPosts();

    // 2. 데이터 유효성 검증
    const validPosts = validatePosts(posts);

    // 3. 카테고리별 그룹화 및 정렬
    const postsJson = await generatePostsJson(validPosts);

    // 4. 출력 디렉토리 생성
    const outputDir = path.join(process.cwd(), 'public', 'posts');
    await fs.mkdir(outputDir, { recursive: true });

    // 5. posts.json 파일 생성
    const outputPath = path.join(process.cwd(), 'src', 'entities', 'post', 'data', 'posts.json');
    await fs.writeFile(outputPath, JSON.stringify(postsJson, null, 2));

    console.log(
      `✅ 성공! ${validPosts.length}개의 게시물 데이터를 public/posts/posts.json 파일로 저장했습니다.`
    );
  } catch (error) {
    console.error('❌ 게시물 데이터 생성 실패:', error);
    process.exit(1); // 노드 프로세스 종료, 오류 코드 1로 종료
  }
}

// 스크립트가 직접 실행되었을 때만 main 함수를 실행한다.
if (require.main === module) {
  main();
}
