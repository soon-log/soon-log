'use client';

import { TagCloud } from '@/components/tag-cloud';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { FilterState, PostMetadata } from '@/types/mdx';

interface FilterBarProps {
  filters: FilterState;
  availableCategories: string[];
  allPosts: PostMetadata[];
  onFiltersChange: (filters: FilterState) => void;
}

export function FilterBar({
  filters,
  availableCategories,
  allPosts,
  onFiltersChange
}: FilterBarProps) {
  const hasActiveFilters = filters.category || filters.tags.length > 0;

  const handleCategoryChange = (value: string) => {
    const category = value === 'all' ? undefined : value;
    onFiltersChange({
      ...filters,
      category
    });
  };

  const handleTagToggle = (tag: string) => {
    const isSelected = filters.tags.includes(tag);
    const newTags = isSelected ? filters.tags.filter((t) => t !== tag) : [...filters.tags, tag];

    onFiltersChange({
      ...filters,
      tags: newTags
    });
  };

  const handleResetFilters = () => {
    onFiltersChange({
      category: undefined,
      tags: []
    });
  };

  return (
    <div className="bg-background space-y-4 rounded-lg border p-4">
      {/* 카테고리 선택 */}
      <div className="space-y-2">
        <label id="category-label" className="pl-1 text-sm font-medium">
          카테고리
        </label>
        <Select value={filters.category || 'all'} onValueChange={handleCategoryChange}>
          <SelectTrigger className="mt-2 w-full" aria-labelledby="category-label">
            <SelectValue placeholder="모든 카테고리" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 카테고리</SelectItem>
            {availableCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* TagCloud 컴포넌트 사용 */}
      <TagCloud allPosts={allPosts} selectedTags={filters.tags} onTagClick={handleTagToggle} />

      {/* 필터 초기화 버튼 */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetFilters}
          disabled={!hasActiveFilters}
        >
          필터 초기화
        </Button>
      </div>
    </div>
  );
}
