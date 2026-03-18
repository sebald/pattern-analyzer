'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import type { LinkProps } from 'next/link';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils/classname.utils';
import { usePathname } from 'next/navigation';

const styles = cva([
  'text-primary-800/50 px-4 py-2 font-medium text-lg lg:px-6',
  '-mb-px border-b-2 border-transparent',
  'hover:text-primary-800/80',
  'aria-[current=page]:text-primary-800 aria-[current=page]:border-primary-800',
]);

// SubNavigation.Item
// ---------------
export interface SubNavigatioItemProps extends LinkProps {
  className?: string;
  children?: ReactNode;
}

const SubNavigationItem = ({
  children,
  className,
  ...props
}: SubNavigatioItemProps) => {
  const path = usePathname();

  return (
    <Link
      {...props}
      className={cn(styles(), className)}
      aria-current={path === props.href ? 'page' : undefined}
    >
      {children}
    </Link>
  );
};

// Props
// ---------------
export interface SubNavigationProps {
  className?: string;
  children?: ReactNode;
}

// Component
// ---------------
export const SubNavigation = ({ className, children }: SubNavigationProps) => (
  <div
    className={cn(
      'flex items-center border-b border-primary-900/10',
      className
    )}
  >
    {children}
  </div>
);

SubNavigation.Item = SubNavigationItem;
