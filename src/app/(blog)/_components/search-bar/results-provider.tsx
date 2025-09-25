import { createContext, useCallback, useContext, useState } from 'react';

import { SearchResult } from '@/app/(blog)/_types/mdx';

const resultsContext = createContext<{
  results: SearchResult[];
  onChangeResults: (results: SearchResult[]) => void;
  reset: () => void;
} | null>(null);

export const useResultsContext = () => {
  const context = useContext(resultsContext);
  if (!context) {
    throw new Error('useResultsContext must be used within a ResultsContextProvider');
  }
  return context;
};

export function ResultsContextProvider({ children }: { children: React.ReactNode }) {
  const [results, setResults] = useState<SearchResult[]>([]);

  const onChangeResults = useCallback((results: SearchResult[]) => {
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
