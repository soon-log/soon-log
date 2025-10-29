'use client';

import { PlaceholderContextProvider } from '@/features/search-posts/model/placeholder-provider';

import { KeywordContextProvider } from '../model/keyword-provider';
import { OpenContextProvider } from '../model/open-provider';
import { ResultsContextProvider } from '../model/results-provider';
import { SelectedIndexContextProvider } from '../model/selected-index-provider';

import { SearchInputContainer } from './search-input-container';
import { SearchResults } from './search-results';

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
              <PlaceholderContextProvider placeholder={placeholder}>
                <SearchInputContainer />
              </PlaceholderContextProvider>
              <SearchResults />
            </ResultsContextProvider>
          </SelectedIndexContextProvider>
        </OpenContextProvider>
      </KeywordContextProvider>
    </div>
  );
}
