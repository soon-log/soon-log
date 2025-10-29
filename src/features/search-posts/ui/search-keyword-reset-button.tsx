import { X } from 'lucide-react';

import { Button } from '@/shared/ui/button';

import { useKeywordContext } from '../model/keyword-provider';

interface SearchKeywordResetButtonProps {
  ref: React.RefObject<HTMLInputElement | null>;
  reset: () => void;
}

export function SearchKeywordResetButton({ ref, reset }: SearchKeywordResetButtonProps) {
  const { keyword } = useKeywordContext();

  const handleClear = () => {
    reset();
    ref.current?.focus();
  };

  if (!keyword) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 p-0"
      onClick={handleClear}
      aria-label="검색어 초기화"
    >
      <X className="h-3 w-3" />
    </Button>
  );
}
