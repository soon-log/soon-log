'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { SearchBar } from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/hooks/use-search';
import { SearchResult } from '@/types/mdx';

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const { results, isLoading, error, setQuery } = useSearch();
  const [displayResults, setDisplayResults] = useState<SearchResult[]>([]);

  // URL의 쿼리 파라미터로 검색 실행
  useEffect(() => {
    if (query) {
      setQuery(query);
    }
  }, [query, setQuery]);

  // 검색 결과를 PostMetadata 형태로 변환
  useEffect(() => {
    setDisplayResults(results);
  }, [results]);

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold">검색</h1>

        <div className="mx-auto max-w-2xl">
          <SearchBar className="mb-8" />

          <div className="text-muted-foreground text-center">
            <Search className="mx-auto mb-4 h-12 w-12" />
            <p>검색어를 입력해주세요.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-4xl font-bold">검색 결과</h1>

      <div className="mb-8">
        <SearchBar className="mx-auto max-w-2xl" />
      </div>

      {/* 검색 정보 */}
      <div className="mb-6">
        <p className="text-muted-foreground text-sm">
          &ldquo;<strong>{query}</strong>&rdquo;에 대한 검색 결과 {displayResults.length}개
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 animate-spin text-2xl">🔍</div>
            <p className="text-muted-foreground">검색 중...</p>
          </div>
        </div>
      ) : error ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-4xl">⚠️</div>
          <h2 className="mb-2 text-xl font-semibold">검색 오류</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push('/')}>
            홈으로 돌아가기
          </Button>
        </div>
      ) : displayResults.length > 0 ? (
        <div className="space-y-6">
          {/* 검색 결과 목록 */}
          <ul className="flex flex-col gap-4">
            {displayResults.map((result, index) => (
              <li key={result.key}>
                <div className="bg-card rounded-lg border p-6 transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-semibold">
                        <Link
                          href={`/post/${result.key}`}
                          className="hover:text-primary hover:underline"
                        >
                          {result.title}
                        </Link>
                      </h3>

                      {result.summary && (
                        <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                          {result.summary}
                        </p>
                      )}

                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        {result.category && (
                          <span className="bg-secondary rounded px-2 py-1">{result.category}</span>
                        )}
                        {result.tags && result.tags.length > 0 && (
                          <div className="flex gap-1">
                            {result.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-xs">
                                #{tag}
                              </span>
                            ))}
                            {result.tags.length > 3 && (
                              <span className="text-xs">+{result.tags.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-muted-foreground text-right text-xs">
                      <div className="mb-1">순위 #{index + 1}</div>
                      <div>관련도: {Math.round(result.score * 100)}%</div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* 페이지네이션 안내 */}
          {displayResults.length >= 10 && (
            <div className="py-6 text-center">
              <p className="text-muted-foreground text-sm">
                더 구체적인 검색어로 결과를 정제해보세요.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="mb-4 text-4xl">📭</div>
          <h2 className="mb-2 text-xl font-semibold">검색 결과가 없습니다</h2>
          <p className="text-muted-foreground mb-4">
            &ldquo;<strong>{query}</strong>&rdquo;와 일치하는 게시물을 찾을 수 없습니다.
          </p>
          <div className="text-muted-foreground space-y-2 text-sm">
            <p>다음을 시도해보세요:</p>
            <ul className="space-y-1">
              <li>• 다른 검색어를 사용해보세요</li>
              <li>• 검색어의 철자를 확인해보세요</li>
              <li>• 더 일반적인 단어를 사용해보세요</li>
            </ul>
          </div>
          <Button variant="outline" className="mt-6" onClick={() => router.push('/')}>
            모든 게시물 보기
          </Button>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return <SearchResultsContent />;
}
