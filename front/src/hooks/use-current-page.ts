'use client';

import { usePathname } from 'next/navigation';

import { navItems } from '@/mfes/lib/build-helpers';
import { NavItem } from '@/types/navigation';

export function useCurrentPage(): NavItem {
  const pathname = usePathname();

  const currentPage = navItems.find((item) => item.url === pathname) ?? null;

  return (
    currentPage ?? {
      title: 'Unknown Page',
      url: pathname,
      icon: 'question'
    }
  );
}
