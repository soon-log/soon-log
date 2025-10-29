import { Search } from 'lucide-react';
import { useRef } from 'react';

import { useKeywordContext } from '../model/keyword-provider';
import { useOpenContext } from '../model/open-provider';

import { SearchInput } from './search-input';
import { SearchKeywordResetButton } from './search-keyword-reset-button';

export function SearchInputContainer() {
  const ref = useRef<HTMLInputElement>(null);

  const { reset: resetKeyword } = useKeywordContext();
  const { close } = useOpenContext();

  const reset = () => {
    resetKeyword();
    close();
  };

  return (
    <div className="relative">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <SearchInput ref={ref} reset={reset} />
      <SearchKeywordResetButton ref={ref} reset={reset} />
    </div>
  );
}
