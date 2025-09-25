import { NotepadTextIcon, WallpaperIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

const LINKS = [
  { href: '/', label: '블로그', Icon: NotepadTextIcon },
  { href: '/webtoon', label: '웹툰', Icon: WallpaperIcon }
];

export default function useLinks() {
  const pathname = usePathname();

  return useMemo(() => {
    return LINKS.filter(({ href }) => {
      if (pathname === href) return false;
      if (href === '/' && pathname.startsWith('/post')) return false;
      return true;
    });
  }, [pathname]);
}
