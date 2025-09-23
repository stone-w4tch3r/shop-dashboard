'use client';

import { usePathname } from 'next/navigation';

import { navItems } from '@/mfes/lib/build-helpers';
import { NavItem } from '@/types/navigation';

export function useCurrentPage(): NavItem | 'unknown-page' {
  const pathname = usePathname();

  const currentPage = navItems.find((item) => item.url === pathname) ?? null;

  return currentPage ?? 'unknown-page';
}

export function useCurrentPageOrFailFast(): NavItem {
  const currentPage = useCurrentPage();

  if (currentPage === 'unknown-page') {
    throw new Error('Current page is unknown, this should never happen');
  }

  return currentPage;
}
