'use client';

import { usePathname } from 'next/navigation';

import { navItems } from '@/mfes/lib/build-helpers';
import { NavItem } from '@/types/navigation';

export function useCurrentPage():
  | NavItem
  | {
      title: string;
      icon: keyof typeof import('@/components/icons').Icons;
      url: string;
    } {
  const pathname = usePathname();

  const currentPage = navItems.find((item) => item.url === pathname) ?? null;

  // Fallback for pages not in navItems
  const getPageInfoFromPath = (path: string) => {
    const segments = path.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    // Capitalize and format the last segment
    const title =
      lastSegment !== undefined && lastSegment !== ''
        ? lastSegment
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        : 'Unknown';

    return {
      title,
      icon: 'question' as keyof typeof import('@/components/icons').Icons,
      url: path
    };
  };

  return currentPage ?? getPageInfoFromPath(pathname);
}
