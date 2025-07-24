import Link from 'next/link';

import { SearchBar } from '@/components/header/search-bar';
import { ThemeToggleButton } from '@/components/theme/theme-toggle-button';

export function Header() {
  return (
    <div className="mb-8 py-6">
      <div className="flex items-center justify-between gap-4">
        <Link href="/">
          <h1 className="text-4xl font-bold">Soon Log</h1>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggleButton />
          <SearchBar className="hidden w-96 md:block" />
        </div>
      </div>
    </div>
  );
}
