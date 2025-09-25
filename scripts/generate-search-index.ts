import fs from 'fs/promises';
import path from 'path';

import lunr from 'lunr';

import { PostMetadata, SearchablePost, SearchIndexData } from '@/app/(blog)/_types/mdx';

import { extractMetadataFromFile } from './generate-posts-data';

/**
 * 한글 검색을 위한 텍스트 전처리 함수
 * @param text - 원본 텍스트
 * @returns 검색을 위해 전처리된 텍스트
 */
function preprocessTextForSearch(text: string): string {
  if (!text) return '';

  const processed: Array<string> = [];

  // 1. 원본 텍스트 추가
  processed.push(text);

  // 2. 단어 단위 분리
  const words = text
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 0);

  for (const word of words) {
    processed.push(word);

    // 3. 한글 단어의 경우 부분 문자열 생성
    if (/[가-힣]/.test(word) && word.length >= 2) {
      // 2글자 단위 n-gram
      for (let i = 0; i <= word.length - 2; i++) {
        processed.push(word.substring(i, i + 2));
      }

      // 3글자 단위 n-gram (3글자 이상인 경우)
      if (word.length >= 3) {
        for (let i = 0; i <= word.length - 3; i++) {
          processed.push(word.substring(i, i + 3));
        }
      }
    }
  }

  return processed.join(' ');
}

/**
 * MDX 콘텐츠에서 텍스트만 추출합니다 (마크다운 문법 제거)
 * @param mdxContent - 원본 MDX 콘텐츠
 * @returns 텍스트만 추출된 문자열
 */
export async function extractContentFromMDX(mdxContent: string): Promise<string> {
  if (!mdxContent.trim()) {
    return '';
  }

  // 코드 블록 제거 (```로 감싸진 부분)
  let cleanContent = mdxContent.replace(/```[\s\S]*?```/g, '');

  // 인라인 코드 제거 (`로 감싸진 부분)
  cleanContent = cleanContent.replace(/`[^`]*`/g, '');

  // 마크다운 헤더 기호 제거 (#)
  cleanContent = cleanContent.replace(/^#+\s*/gm, '');

  // 마크다운 링크 제거 ([text](url))
  cleanContent = cleanContent.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');

  // 마크다운 이미지 제거 (![alt](url))
  cleanContent = cleanContent.replace(/!\[([^\]]*)\]\([^)]*\)/g, '');

  // 볼드/이탤릭 마크다운 제거 (**bold**, *italic*)
  cleanContent = cleanContent.replace(/\*\*([^*]*)\*\*/g, '$1');
  cleanContent = cleanContent.replace(/\*([^*]*)\*/g, '$1');

  // 여러 줄바꿈을 하나로 정리
  cleanContent = cleanContent.replace(/\n\s*\n/g, '\n');

  // 앞뒤 공백 제거
  return cleanContent.trim();
}

/**
 * 메타데이터와 콘텐츠로 검색 가능한 게시물 객체를 생성합니다
 * @param metadata - 게시물 메타데이터
 * @param content - 게시물 콘텐츠
 * @returns 검색 가능한 게시물 객체
 */
export async function createSearchablePost(
  metadata: PostMetadata,
  content: string
): Promise<SearchablePost> {
  return {
    key: metadata.key,
    title: metadata.title,
    content,
    summary: metadata.summary,
    tags: metadata.tags,
    category: metadata.category,
    date: metadata.date
  };
}

/**
 * 검색 가능한 게시물들로부터 Lunr.js 인덱스를 생성합니다
 * @param searchablePosts - 검색 가능한 게시물 배열
 * @returns 검색 인덱스 데이터
 */
export async function generateSearchIndex(
  searchablePosts: Array<SearchablePost>
): Promise<SearchIndexData> {
  // 게시물 저장소 생성
  const store: Record<string, SearchablePost> = {};
  for (const post of searchablePosts) {
    store[post.key] = post;
  }

  // Lunr.js 인덱스 생성
  const index = lunr(function () {
    // 기본 pipeline 제거 (한글 지원을 위해)
    this.pipeline.reset();
    this.searchPipeline.reset();

    this.ref('key');
    this.field('title', { boost: 10 }); // 제목에 높은 가중치
    this.field('content', { boost: 1 });
    this.field('summary', { boost: 5 }); // 요약에 중간 가중치
    this.field('tags', { boost: 8 }); // 태그에 높은 가중치
    this.field('category', { boost: 3 }); // 카테고리에 중간 가중치

    for (const post of searchablePosts) {
      this.add({
        key: post.key,
        title: preprocessTextForSearch(post.title),
        content: preprocessTextForSearch(post.content),
        summary: preprocessTextForSearch(post.summary || ''),
        tags: preprocessTextForSearch(post.tags?.join(' ') || ''),
        category: preprocessTextForSearch(post.category || '')
      });
    }
  });

  return {
    index: index.toJSON(),
    store
  };
}

/**
 * 모든 게시물에서 검색 가능한 데이터를 수집합니다
 * @returns 모든 검색 가능한 게시물
 */
export async function collectAllSearchablePosts(): Promise<Array<SearchablePost>> {
  const postsDir = path.join(process.cwd(), 'posts');
  const searchablePosts: Array<SearchablePost> = [];

  try {
    const postFolders = await fs.readdir(postsDir, { withFileTypes: true });
    const postDirs = postFolders
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const postDir of postDirs) {
      const postPath = path.join(postsDir, postDir);
      const metaPath = path.join(postPath, 'meta.ts');
      const mdxPath = path.join(postPath, 'index.mdx');

      try {
        // 필수 파일 존재 확인
        await fs.access(metaPath);
        await fs.access(mdxPath);

        // 메타데이터 추출
        const metadata = await extractMetadataFromFile(metaPath);

        // MDX 콘텐츠 읽기 및 텍스트 추출
        const mdxContent = await fs.readFile(mdxPath, 'utf-8');
        const content = await extractContentFromMDX(mdxContent);

        // 검색 가능한 게시물 생성
        const searchablePost = await createSearchablePost(metadata, content);
        searchablePosts.push(searchablePost);
      } catch (error) {
        console.warn(`[경고] ${postDir} 처리 중 오류 발생:`, error);
      }
    }

    return searchablePosts;
  } catch (error) {
    console.error('[오류] posts 디렉토리 읽기 실패:', error);
    throw error;
  }
}

/**
 * 메인 함수: 검색 인덱스를 생성하고 파일로 저장합니다
 */
export async function main(): Promise<void> {
  try {
    console.log('🔍 검색 인덱스 생성 시작...');

    // 모든 검색 가능한 게시물 수집
    const searchablePosts = await collectAllSearchablePosts();
    console.log(`📄 ${searchablePosts.length}개의 게시물을 찾았습니다.`);

    // 검색 인덱스 생성
    const searchIndexData = await generateSearchIndex(searchablePosts);
    console.log('🏗️ 검색 인덱스 생성 완료');

    // 출력 디렉토리 생성
    const outputDir = path.join(process.cwd(), 'public', 'data');
    await fs.mkdir(outputDir, { recursive: true });

    // 검색 인덱스 파일 저장
    const outputPath = path.join(outputDir, 'lunr-index.json');
    await fs.writeFile(outputPath, JSON.stringify(searchIndexData, null, 2), 'utf-8');

    console.log(`✅ 검색 인덱스가 ${outputPath}에 저장되었습니다.`);
  } catch (error) {
    console.error('❌ 검색 인덱스 생성 실패:', error);
    process.exit(1);
  }
}

// 스크립트가 직접 실행될 때만 main 함수 호출
if (require.main === module) {
  main();
}
