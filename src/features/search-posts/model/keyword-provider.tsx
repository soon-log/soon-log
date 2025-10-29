import { createContext, useCallback, useContext, useState } from 'react';

const keywordContext = createContext<{
  keyword: string;
  onChangeKeyword: (keyword: string) => void;
  reset: () => void;
} | null>(null);

export const useKeywordContext = () => {
  const ctx = useContext(keywordContext);
  if (!ctx) {
    throw new Error('useKeywordContext must be used within a KeywordContextProvider');
  }
  return ctx;
};

export function KeywordContextProvider({ children }: { children: React.ReactNode }) {
  const [keyword, setKeyword] = useState('');

  const onChangeKeyword = useCallback((keyword: string) => {
    setKeyword(keyword);
  }, []);

  const reset = useCallback(() => {
    setKeyword('');
  }, []);

  return (
    <keywordContext.Provider value={{ keyword, onChangeKeyword, reset }}>
      {children}
    </keywordContext.Provider>
  );
}
