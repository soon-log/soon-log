import { useRouter } from 'next/navigation';

import { SearchResult } from '@/entities/post';

import { useOpenContext } from '../model/open-provider';
import { useSelectedIndexContext } from '../model/selected-index-provider';

export const MAX_DISPLAY_TAGS = 3; // 표시할 최대 태그 수

export function SearchResultsList({ results }: { results: Array<SearchResult> }) {
  const router = useRouter();
  const { close } = useOpenContext();
  const { selectedIndex, onChangeSelectedIndex } = useSelectedIndexContext();

  const navigateToPostPage = (key: string) => {
    router.push(`/post/${key}`);
    close();
  };

  return (
    <div className="max-h-96 overflow-y-auto">
      {results.map((result, index) => (
        <SearchResultsItem
          key={result.key}
          result={result}
          index={index}
          selectedIndex={selectedIndex}
          onChangeSelectedIndex={onChangeSelectedIndex}
          navigateToPostPage={navigateToPostPage}
        />
      ))}
    </div>
  );
}

type SearchResultsItemProps = {
  result: SearchResult;
  index: number;
  selectedIndex: number;
  onChangeSelectedIndex: (index: number) => void;
  navigateToPostPage: (key: string) => void;
};

function SearchResultsItem({
  result,
  index,
  selectedIndex,
  onChangeSelectedIndex,
  navigateToPostPage
}: SearchResultsItemProps) {
  return (
    <div
      key={result.key}
      role="option"
      aria-selected={index === selectedIndex}
      aria-label={result.title}
      className={`border-border hover:bg-muted cursor-pointer border-b p-3 last:border-b-0 ${
        index === selectedIndex ? 'bg-muted' : ''
      }`}
      onClick={() => navigateToPostPage(result.key)}
      onMouseEnter={() => onChangeSelectedIndex(index)}
    >
      <div className="text-sm font-medium">{result.title}</div>
      {result.summary && (
        <div className="text-muted-foreground mt-1 line-clamp-2 text-xs">{result.summary}</div>
      )}
      <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
        {result.category && (
          <span className="bg-secondary rounded px-1.5 py-0.5">{result.category}</span>
        )}
        {result.tags && result.tags.length > 0 && (
          <span className="flex gap-1">
            {result.tags.slice(0, MAX_DISPLAY_TAGS).map((tag: string) => (
              <span key={tag} className="text-xs">
                #{tag}
              </span>
            ))}
          </span>
        )}
      </div>
    </div>
  );
}
