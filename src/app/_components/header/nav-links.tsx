'use client';

import Link from 'next/link';

import useLinks from '@/app/_components/header/use-links';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const NavLinks = () => {
  const links = useLinks();
  return (
    <ul className="flex items-center justify-between gap-6">
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={href}>
                <Icon className="size-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;
