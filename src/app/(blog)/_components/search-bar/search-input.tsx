import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { BLUR_TIMEOUT_MS } from './constants';
import { useKeywordContext } from './keyword-provider';
import { useOpenContext } from './open-provider';
import { useResultsContext } from './results-provider';
import { useSelectedIndexContext } from './selected-index-provider';

interface SearchInputProps {
  placeholder: string;
}

export function SearchInput({ placeholder }: SearchInputProps) {
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);

  const { keyword, onChangeKeyword, reset: resetKeyword } = useKeywordContext();
  const { isOpen, close, open } = useOpenContext();
  const {
    selectedIndex,
    onChangeSelectedIndex,
    reset: resetSelectedIndex
  } = useSelectedIndexContext();
  const { results } = useResultsContext();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (true) {
      case e.key === 'ArrowDown':
        e.preventDefault();
        onChangeSelectedIndex(selectedIndex + 1);
        break;
      case e.key === 'ArrowUp':
        e.preventDefault();
        onChangeSelectedIndex(selectedIndex - 1);
        break;
      case e.key === 'Enter':
        e.preventDefault();
        // 결과를 포커스한 상태로 엔터를 누르면
        if (selectedIndex >= 0 && results[selectedIndex]) {
          router.push(`/post/${results[selectedIndex].key}`);
          reset();
        }
        break;
      case e.key === 'Escape':
        e.preventDefault();
        close();
        resetSelectedIndex();
        ref.current?.blur();
        break;
    }
  };

  const handleFocus = () => {
    if (keyword.trim()) {
      open();
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      close();
      resetSelectedIndex();
    }, BLUR_TIMEOUT_MS);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChangeKeyword(value);
    if (!isOpen && value.trim().length > 0) {
      open();
    }
  };

  const reset = () => {
    resetKeyword();
    close();
  };

  const handleClear = () => {
    reset();
    ref.current?.focus();
  };

  return (
    <div className="relative">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        ref={ref}
        type="text"
        placeholder={placeholder}
        value={keyword}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="focus-visible:ring-ring placeholder:text-muted-foreground pl-10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label="검색"
        role="combobox"
        aria-haspopup="listbox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
      />
      {keyword && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 p-0"
          onClick={handleClear}
          aria-label="검색어 초기화"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
