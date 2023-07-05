'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button, Link, Logo, Sheet, type LinkProps } from '@/ui';
import { SITE_NAVIGATION } from '@/lib/env';
import { cn } from '@/lib/utils';

import { headline } from '../fonts';

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
        <Button>
          M<span className="sr-only">Toggle Menu</span>
        </Button>
      </Sheet.Trigger>
      <Sheet.Content side="left" className="flex flex-col gap-9 pr-0 pt-10">
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
        <div className="flex flex-col gap-5 pl-9">
          {SITE_NAVIGATION.map(({ name, href }) => (
            <NavLink
              key={href}
              href={href}
              close={close}
              className="text-lg font-medium"
            >
              {name}
            </NavLink>
          ))}
        </div>
      </Sheet.Content>
    </Sheet>
  );
};
