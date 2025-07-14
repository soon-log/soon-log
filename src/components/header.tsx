'use client';

import { SearchBar } from '@/components/search-bar';

export function Header() {
  return (
    <div className="mb-8">
      <h1 className="mb-6 text-4xl font-bold">Soon Log</h1>
      <div className="mx-auto max-w-2xl">
        <SearchBar />
      </div>
    </div>
  );
}
