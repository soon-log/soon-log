import { createContext, useContext } from 'react';

const placeholderContext = createContext<{
  placeholder: string;
} | null>(null);

export const usePlaceholderContext = () => {
  const ctx = useContext(placeholderContext);
  if (!ctx) {
    throw new Error('usePlaceholderContext must be used within a PlaceholderContextProvider');
  }
  return ctx;
};

export function PlaceholderContextProvider({
  children,
  placeholder
}: {
  children: React.ReactNode;
  placeholder: string;
}) {
  return (
    <placeholderContext.Provider value={{ placeholder }}>{children}</placeholderContext.Provider>
  );
}
