import { createContext, useCallback, useContext, useState } from 'react';

const keywordContext = createContext<{
  keyword: string;
  onChangeKeyword: (keyword: string) => void;
  reset: () => void;
} | null>(null);

export const useKeywordContext = () => {
  const context = useContext(keywordContext);
  if (!context) {
    throw new Error('useKeywordContext must be used within a KeywordContextProvider');
  }
  return context;
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
