import { createContext, useCallback, useContext, useState } from 'react';

const selectedIndexContext = createContext<{
  selectedIndex: number;
  onChangeSelectedIndex: (selectedIndex: number) => void;
  reset: () => void;
} | null>(null);

export const useSelectedIndexContext = () => {
  const context = useContext(selectedIndexContext);
  if (!context) {
    throw new Error('useSelectedIndexContext must be used within a SelectedIndexContextProvider');
  }
  return context;
};

export function SelectedIndexContextProvider({ children }: { children: React.ReactNode }) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const onChangeSelectedIndex = useCallback((selectedIndex: number) => {
    setSelectedIndex(selectedIndex);
  }, []);

  const reset = useCallback(() => {
    setSelectedIndex(-1);
  }, []);

  return (
    <selectedIndexContext.Provider value={{ selectedIndex, onChangeSelectedIndex, reset }}>
      {children}
    </selectedIndexContext.Provider>
  );
}
