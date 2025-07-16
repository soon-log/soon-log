'use client';

import { SearchBar } from '@/components/search-bar';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Soon Log</h1>
        <ThemeToggle />
      </div>
      <div className="mx-auto mt-6 max-w-2xl">
        <SearchBar />
      </div>
    </div>
  );
}
