'use client';

import Link from 'next/link';
import { usePathname, useSelectedLayoutSegment } from 'next/navigation';
import { cn } from '@/lib/utils';

// NavigationItems
// ---------------
interface NavigationItemProps {
  slug?: string;
  path: string;
  children: React.ReactNode;
}

const NavigationItem = ({ path, slug, children }: NavigationItemProps) => {
  const segment = useSelectedLayoutSegment();
  const href = `${path}/${slug ?? ''}`;
  const isCurrent =
    // Page where the navigation is
    (!slug && segment === null) ||
    // Nested pages
    segment === slug;

  return (
    <Link
      data-state={isCurrent ? 'active' : 'inactive'}
      className={cn(
        'flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary-100 px-6 py-2 text-primary-500 hover:bg-primary-200 hover:text-primary-800 lg:px-32',
        'data-active:bg-primary-300 data-active:text-primary-800'
      )}
      href={href}
    >
      {children}
    </Link>
  );
};

// Props
// ---------------
export interface NavigationProps {
  className?: string;
  items: {
    label: React.ReactNode;
    slug?: string;
  }[];
}

// Component
// ---------------
export const Navigation = ({ className, items }: NavigationProps) => {
  const path = usePathname();

  return (
    <div
      role="navigation"
      className={cn(
        'grid auto-cols-fr grid-flow-col gap-2 text-sm font-medium lg:text-lg',
        className
      )}
    >
      {items.map(item => (
        <NavigationItem key={path + item.slug} path={path} slug={item.slug}>
          {item.label}
        </NavigationItem>
      ))}
    </div>
  );
};
