'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/shared/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/ui/collapsible';

export function FilterCollapsibleProvider({ children }: { children: React.ReactNode }) {
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
      <CollapsibleContent className="mt-4">{children}</CollapsibleContent>
    </Collapsible>
  );
}
