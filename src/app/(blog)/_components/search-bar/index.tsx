'use client';

import { KeywordContextProvider } from './keyword-provider';
import { OpenContextProvider } from './open-provider';
import { ResultsContextProvider } from './results-provider';
import { SearchInput } from './search-input';
import { SearchResults } from './search-results';
import { SelectedIndexContextProvider } from './selected-index-provider';

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
