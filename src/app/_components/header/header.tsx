import Link from 'next/link';

import { ThemeToggleButton } from '@/components/theme/theme-toggle-button';

import NavLinks from './nav-links';

export function Header() {
  return (
    <div className="mx-3 py-6">
      <div className="flex items-center justify-between gap-4">
        <Link href="/">
          <h1 className="text-4xl font-bold">Soon Log</h1>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggleButton />
          <NavLinks />
        </div>
      </div>
    </div>
  );
}
