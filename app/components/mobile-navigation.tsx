'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button, Link, Logo, Sheet, type LinkProps } from '@/ui';
import {
  secondaryNavigation,
  siteNavigation,
  xWingResources,
} from '@/lib/config';
import { cn } from '@/lib/utils';

import { headline } from '../fonts';
import { Lines } from '@/ui/icons';

// Helper
// ---------------
interface NavLinkProps extends LinkProps {
  close?: () => void;
  children: React.ReactNode;
}

const NavLink = ({ href, close, children, ...props }: NavLinkProps) => {
  const { push } = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        push(`${href}`);
        close?.();
      }}
      {...props}
    >
      {children}
    </Link>
  );
};

// Component
// ---------------
export const MobileNavigation = () => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Sheet.Trigger asChild>
        <Button
          variant="link"
          size="inherit"
          className="text-primary-900 hover:text-primary-700 md:hidden"
        >
          <Lines className="h-7 w-7" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </Sheet.Trigger>
      <Sheet.Content side="left" className="flex flex-col gap-12 pr-0 pt-10">
        <NavLink
          href="/"
          close={close}
          className={cn(
            headline.variable,
            'prose flex items-center gap-1 font-headline text-lg font-extrabold uppercase text-primary-900 hover:text-primary-700'
          )}
        >
          <Logo className="h-8 w-8" />
          Pattern Analyzer
        </NavLink>
        <div className="flex flex-col gap-7 pl-2">
          {[...siteNavigation, ...secondaryNavigation].map(({ name, href }) => (
            <NavLink
              key={href}
              href={href}
              close={close}
              className="text-xl font-medium hover:text-primary-500"
            >
              {name}
            </NavLink>
          ))}
        </div>
        <div className="flex flex-col gap-4 pl-2">
          <div className="font-medium">X-Wing Resources</div>
          {xWingResources.map(({ name, href }) => (
            <NavLink
              key={href}
              href={href}
              className="text-secondary-500 hover:text-primary-500"
              target="_blank"
              rel="noreferrer"
            >
              {name}
            </NavLink>
          ))}
        </div>
      </Sheet.Content>
    </Sheet>
  );
};
