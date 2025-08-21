import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { PostMetadata } from '@/types/mdx';

interface TagCloudProps {
  posts: PostMetadata[];
  selectedTags: string[];
  onTagClick: (tag: string) => void;
}

interface TagInfo {
  name: string;
  count: number;
}

export function TagCloud({ posts, selectedTags, onTagClick }: TagCloudProps) {
  console.log({ posts, selectedTags });
  const sortedTags = useMemo(() => {
    const tagCounts = new Map<string, number>();
    for (const post of posts) {
      if (!post.tags) {
        continue;
      }
      for (const tag of post.tags) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
    }

    const tags: TagInfo[] = Array.from(tagCounts).map(([name, count]) => ({
      name,
      count
    }));

    return tags.sort((a, b) => {
      // selectedTags에 포함된 태그를 최우선으로 정렬
      const aSelected = selectedTags.includes(a.name);
      const bSelected = selectedTags.includes(b.name);

      if (aSelected && !bSelected) {
        return -1;
      }
      if (!aSelected && bSelected) {
        return 1;
      }

      // 둘 다 선택되었거나 둘 다 선택되지 않은 경우, 기존 정렬 로직 적용
      if (a.count !== b.count) {
        return b.count - a.count;
      }
      return a.name.localeCompare(b.name);
    });
  }, [posts, selectedTags]);

  if (sortedTags.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">사용 가능한 태그가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">태그</h3>
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
