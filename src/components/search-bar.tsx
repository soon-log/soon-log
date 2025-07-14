'use client';

import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { useSearch } from '@/hooks/use-search';
import { SearchResult } from '@/types/mdx';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export function SearchBar({
  className = '',
  placeholder = '검색어를 입력하세요...'
}: SearchBarProps) {
  const router = useRouter();
  const { query, setQuery, results, isLoading, error } = useSearch();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // 검색어나 결과가 있을 때만 드롭다운 표시
  useEffect(() => {
    setIsOpen(query.trim().length > 0);
    setSelectedIndex(-1);
  }, [query, results]);

  // 키보드 이벤트 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Enter' && query.trim()) {
        // 검색 결과 페이지로 이동
        router.push(`/search?q=${encodeURIComponent(query)}`);
        setIsOpen(false);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        } else if (query.trim()) {
          router.push(`/search?q=${encodeURIComponent(query)}`);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // 검색 결과 클릭 처리
  const handleResultClick = (result: SearchResult) => {
    router.push(`/post/${result.key}`);
    setIsOpen(false);
    setQuery('');
    inputRef.current?.blur();
  };

  // 입력 필드 포커스 아웃 처리
  const handleBlur = () => {
    // 약간의 지연을 두어 결과 클릭이 처리될 수 있도록 함
    setTimeout(() => {
      setIsOpen(false);
      setSelectedIndex(-1);
    }, 200);
  };

  // 검색어 클리어
  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      {/* 검색 입력 필드 */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          onBlur={handleBlur}
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border py-2 pr-10 pl-10 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="검색"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
        />

        {/* 검색어 클리어 버튼 */}
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 p-0"
            onClick={clearSearch}
            aria-label="검색어 지우기"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* 검색 결과 드롭다운 */}
      {isOpen && (
        <div
          ref={resultsRef}
          className="bg-popover absolute top-full z-50 mt-1 w-full rounded-md border shadow-md"
          role="listbox"
          aria-label="검색 결과"
        >
          {isLoading ? (
            <div className="text-muted-foreground p-4 text-center text-sm">검색 중...</div>
          ) : error ? (
            <div className="text-destructive p-4 text-center text-sm">{error}</div>
          ) : results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={result.key}
                  role="option"
                  aria-selected={index === selectedIndex}
                  aria-label={result.title}
                  className={`border-border hover:bg-muted cursor-pointer border-b p-3 last:border-b-0 ${
                    index === selectedIndex ? 'bg-muted' : ''
                  }`}
                  onClick={() => handleResultClick(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="text-sm font-medium">{result.title}</div>
                  {result.summary && (
                    <div className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                      {result.summary}
                    </div>
                  )}
                  <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                    {result.category && (
                      <span className="bg-secondary rounded px-1.5 py-0.5">{result.category}</span>
                    )}
                    {result.tags && result.tags.length > 0 && (
                      <span className="flex gap-1">
                        {result.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs">
                            #{tag}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* 더 많은 결과 보기 */}
              {results.length >= 10 && (
                <div
                  className="bg-muted/50 hover:bg-muted cursor-pointer border-t p-3 text-center text-sm"
                  onClick={() => {
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                    setIsOpen(false);
                  }}
                >
                  모든 검색 결과 보기 →
                </div>
              )}
            </div>
          ) : query.trim() ? (
            <div className="text-muted-foreground p-4 text-center text-sm">
              검색 결과가 없습니다
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
