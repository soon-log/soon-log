'use client';

import { SearchBar } from '@/components/search-bar';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-4xl font-bold">Soon Log</h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <SearchBar className="hidden w-96 md:block" />
        </div>
      </div>
    </div>
  );
}
