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

  // Function to find the matching nav item recursively
  const findMatchingNavItem = (
    items: NavItem[],
    path: string
  ): NavItem | null => {
    for (const item of items) {
      // Check if current item matches
      if (item.url === path) {
        return item;
      }

      // Check child items if they exist
      if (item.items && item.items.length > 0) {
        const childMatch = findMatchingNavItem(item.items, path);
        if (childMatch) {
          return childMatch;
        }
      }
    }
    return null;
  };

  const currentPage = findMatchingNavItem(navItems, pathname);

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
