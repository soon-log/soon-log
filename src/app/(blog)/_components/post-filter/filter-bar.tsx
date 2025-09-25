import { SearchBar } from '@/app/(blog)/_components/search-bar';
import { useFilterState } from '@/app/(blog)/_hooks/use-filter-state';
import { useFilters } from '@/app/(blog)/_hooks/use-filters';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { TagCloud } from './tag-cloud';

export function FilterBar() {
  const { categories, tags } = useFilters();
  const { filters, updateFilters } = useFilterState();

  const hasActiveFilters = filters.category || filters.tags.length > 0;

  const handleCategoryChange = (value: string) => {
    const category = value === 'all' ? null : value;
    updateFilters({
      ...filters,
      category
    });
  };

  const handleTagToggle = (tag: string) => {
    const isSelected = filters.tags.includes(tag);
    const newTags = isSelected ? filters.tags.filter((t) => t !== tag) : [...filters.tags, tag];

    updateFilters({
      ...filters,
      tags: newTags
    });
  };

  const handleResetFilters = () => {
    updateFilters({
      category: null,
      tags: [],
      search: null
    });
  };

  return (
    <div className="bg-background space-y-4 rounded-lg border p-4">
      <div className="space-y-2">
        <div className="mb-3">
          <label id="search-label" className="font-nanum-myeongjo pb-1 pl-1 text-lg font-medium">
            검색
            <SearchBar className="mt-2" />
          </label>
        </div>
        <label id="category-label" className="font-nanum-myeongjo pb-1 pl-1 text-lg font-medium">
          카테고리
        </label>
        <Select value={filters.category || 'all'} onValueChange={handleCategoryChange}>
          <SelectTrigger className="mt-2 w-full" aria-labelledby="category-label">
            <SelectValue placeholder="모든 카테고리" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 카테고리</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <TagCloud tags={tags} selectedTags={filters.tags} onTagClick={handleTagToggle} />
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
