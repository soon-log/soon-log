'use client';
import { useSuspenseQuery } from '@tanstack/react-query';

import { QUERY_KEY, getFilteredPosts } from '@/entities/post';
import { useQueryFilters } from '@/features/filter-posts';
import { SearchBar } from '@/features/search-posts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

import { ResetFilterButton } from './reset-filter-button';
import { TagCloud } from './tag-cloud';

export function FilterBar() {
  const {
    data: { categories, tags }
  } = useSuspenseQuery<{ categories: Array<string>; tags: Array<string> }>({
    queryKey: QUERY_KEY.FILTERS,
    queryFn: getFilteredPosts
  });

  const { filters, updateFilters } = useQueryFilters();

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
        <Select
          value={filters.category || 'all'}
          onValueChange={(value) =>
            updateFilters({ ...filters, category: value === 'all' ? null : value })
          }
        >
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
      <TagCloud
        tags={tags}
        selectedTags={filters.tags}
        onTagClick={(tag) => {
          const isSelected = filters.tags.includes(tag);
          const newTags = isSelected
            ? filters.tags.filter((t: string) => t !== tag)
            : [...filters.tags, tag];

          updateFilters({
            ...filters,
            tags: newTags
          });
        }}
      />
      <div className="flex justify-end">
        <ResetFilterButton
          onClick={() => updateFilters({ category: null, tags: [], search: null })}
          disabled={!!filters.category && filters.tags.length > 0}
        />
      </div>
    </div>
  );
}
