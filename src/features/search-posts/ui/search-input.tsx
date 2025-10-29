import { useRouter } from 'next/navigation';

import { Input } from '@/shared/ui/input';

import { useKeywordContext } from '../model/keyword-provider';
import { useOpenContext } from '../model/open-provider';
import { usePlaceholderContext } from '../model/placeholder-provider';
import { useResultsContext } from '../model/results-provider';
import { useSelectedIndexContext } from '../model/selected-index-provider';

const BLUR_TIMEOUT_MS = 200; // 결과 클릭 처리를 위한 지연 시간

interface SearchInputProps {
  ref: React.RefObject<HTMLInputElement | null>;
  reset: () => void;
}

const useSearchInput = ({ reset, ref }: SearchInputProps) => {
  const router = useRouter();
  const { keyword, onChangeKeyword } = useKeywordContext();
  const { isOpen, close, open } = useOpenContext();
  const {
    selectedIndex,
    onChangeSelectedIndex,
    reset: resetSelectedIndex
  } = useSelectedIndexContext();
  const { results } = useResultsContext();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const resultsLength = results.length;
    if (e.nativeEvent?.isComposing || e.nativeEvent?.keyCode === 229) {
      return;
    }

    switch (true) {
      case e.key === 'ArrowDown':
        e.preventDefault();
        onChangeSelectedIndex((selectedIndex + 1) % resultsLength);
        break;
      case e.key === 'ArrowUp':
        e.preventDefault();
        onChangeSelectedIndex((selectedIndex - 1 + resultsLength) % resultsLength);
        break;
      case e.key === 'Enter':
        // 결과를 포커스한 상태로 엔터를 누르면
        if (selectedIndex >= 0 && results[selectedIndex]) {
          e.preventDefault();
          router.push(`/post/${results[selectedIndex].key}`);
          reset();
        }
        break;
      case e.key === 'Backspace':
        resetSelectedIndex();
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

  return {
    keyword,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
    onBlur: handleBlur,
    isOpen
  };
};

export function SearchInput({ ref, reset }: SearchInputProps) {
  const {
    keyword,
    onChange,
    onKeyDown,
    onFocus: handleFocus,
    onBlur: handleBlur,
    isOpen
  } = useSearchInput({ reset, ref });
  const { placeholder } = usePlaceholderContext();

  return (
    <Input
      ref={ref}
      type="text"
      placeholder={placeholder}
      value={keyword}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="focus-visible:ring-ring placeholder:text-muted-foreground pl-10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      aria-label="검색"
      role="combobox"
      aria-haspopup="listbox"
      aria-autocomplete="list"
      aria-expanded={isOpen}
    />
  );
}
