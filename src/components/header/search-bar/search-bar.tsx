'use client';

import { KeywordContextProvider } from '@/components/header/search-bar/keyword-provider';
import { OpenContextProvider } from '@/components/header/search-bar/open-provider';
import { ResultsContextProvider } from '@/components/header/search-bar/results-provider';
import { SearchResults } from '@/components/header/search-bar/search-results';
import { SelectedIndexContextProvider } from '@/components/header/search-bar/selected-index-provider';

import { SearchInput } from './search-input';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export function SearchBar({
  className = '',
  placeholder = '검색어를 입력하세요...'
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <KeywordContextProvider>
        <OpenContextProvider>
          <SelectedIndexContextProvider>
            <ResultsContextProvider>
              <SearchInput placeholder={placeholder} />
              <SearchResults />
            </ResultsContextProvider>
          </SelectedIndexContextProvider>
        </OpenContextProvider>
      </KeywordContextProvider>
    </div>
  );
}
