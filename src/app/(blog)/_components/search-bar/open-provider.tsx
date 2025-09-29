import { createContext, useCallback, useContext, useState } from 'react';

const openContext = createContext<{
  isOpen: boolean;
  close: () => void;
  open: () => void;
} | null>(null);

export const useOpenContext = () => {
  const context = useContext(openContext);
  if (!context) {
    throw new Error('useOpenContext must be used within a OpenContextProvider');
  }
  return context;
};

export function OpenContextProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  return <openContext.Provider value={{ isOpen, close, open }}>{children}</openContext.Provider>;
}
