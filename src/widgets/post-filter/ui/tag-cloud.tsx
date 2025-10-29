import { useMemo } from 'react';

import { Button } from '@/shared/ui/button';

import { getTagInfos, sortTags } from '../lib/tag-logic';

interface TagCloudProps {
  tags: Array<string>;
  selectedTags: Array<string>;
  onTagClick: (tag: string) => void;
}

export function TagCloud({ tags, selectedTags, onTagClick }: TagCloudProps) {
  const sortedTags = useMemo(() => {
    const tagInfos = getTagInfos(tags);

    return sortTags(tagInfos, selectedTags);
  }, [selectedTags, tags]);

  if (sortedTags.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">사용 가능한 태그가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-nanum-myeongjo mb-1 pl-1 text-lg">태그</h3>
      <div className="flex flex-wrap gap-2">
        {sortedTags.map((tag) => {
          const isSelected = selectedTags.includes(tag.name);

          return (
            <Button
              key={tag.name}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTagClick(tag.name)}
              aria-pressed={isSelected}
              className="text-sm"
            >
              {tag.name} ({tag.count})
            </Button>
          );
        })}
      </div>
    </div>
  );
}
