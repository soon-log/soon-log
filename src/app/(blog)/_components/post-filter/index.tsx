'use client';

import { ChevronDown } from 'lucide-react';
import { Suspense, useState } from 'react';

import { FilterBar } from '@/app/(blog)/_components/post-filter/filter-bar';
import { usePrefetchFilters } from '@/app/(blog)/_hooks/use-prefetch-filters';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function PostFilter() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggle = () => setIsFilterOpen((open) => !open);

  usePrefetchFilters();

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
        <Suspense>
          <FilterBar />
        </Suspense>
      </CollapsibleContent>
    </Collapsible>
  );
}
