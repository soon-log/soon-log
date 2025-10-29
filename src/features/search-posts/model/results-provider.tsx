import { createContext, useCallback, useContext, useState } from 'react';

import { SearchResult } from '@/entities/post';

const resultsContext = createContext<{
  results: SearchResult[];
  onChangeResults: (results: SearchResult[]) => void;
  reset: () => void;
} | null>(null);

export const useResultsContext = () => {
  const ctx = useContext(resultsContext);
  if (!ctx) {
    throw new Error('useResultsContext must be used within a ResultsContextProvider');
  }
  return ctx;
};

export function ResultsContextProvider({ children }: { children: React.ReactNode }) {
  const [results, setResults] = useState<Array<SearchResult>>([]);

  const onChangeResults = useCallback((results: Array<SearchResult>) => {
    setResults(results);
  }, []);

  const reset = useCallback(() => {
    setResults([]);
  }, []);

  return (
    <resultsContext.Provider value={{ results, onChangeResults, reset }}>
      {children}
    </resultsContext.Provider>
  );
}
