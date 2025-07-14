import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { PostMetadata } from '@/types/mdx';

interface TagCloudProps {
  allPosts: PostMetadata[];
  selectedTags: string[];
  onTagClick: (tag: string) => void;
}

interface TagInfo {
  name: string;
  count: number;
}

export function TagCloud({ allPosts, selectedTags, onTagClick }: TagCloudProps) {
  // 태그별 빈도 계산 및 정렬
  const sortedTags = useMemo(() => {
    const tagCounts = new Map<string, number>();

    // 모든 게시물에서 태그 추출하여 빈도 계산
    for (const post of allPosts) {
      if (post.tags) {
        for (const tag of post.tags) {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        }
      }
    }

    // TagInfo 배열로 변환하고 정렬 (빈도 높은 순, 같으면 알파벳 순)
    const tags: TagInfo[] = Array.from(tagCounts.entries()).map(([name, count]) => ({
      name,
      count
    }));

    return tags.sort((a, b) => {
      if (a.count !== b.count) {
        return b.count - a.count; // 빈도 높은 순
      }
      return a.name.localeCompare(b.name); // 알파벳 순
    });
  }, [allPosts]);

  // 태그가 없는 경우
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
              role="button"
              tabIndex={0}
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
