'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useFilterState } from '@/hooks/use-filter-state';

import { TagCloud } from './tag-cloud';

type PostFilterProps = {
  categories: string[];
  tags: string[];
};

export function PostFilter({ categories, tags }: PostFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggle = () => setIsFilterOpen((open) => !open);

  return (
    <Collapsible open={isFilterOpen} onOpenChange={toggle}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="hidden w-full justify-between md:flex">
          필터 옵션
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4">
        <FilterBar categories={categories} tags={tags} />
      </CollapsibleContent>
    </Collapsible>
  );
}

interface FilterBarProps {
  categories: string[];
  tags: string[];
}

export function FilterBar({ categories, tags }: FilterBarProps) {
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
        <label id="category-label" className="pl-1 text-sm font-medium">
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
