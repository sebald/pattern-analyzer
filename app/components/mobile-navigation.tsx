'use client';

import { useState } from 'react';
import { Button, Link, Logo, Sheet } from '@/ui';
import { cn } from '@/lib/utils';

import { headline } from '../fonts';

export const MobileNavigation = () => {
  const [open, setOpen] = useState(false);

  //className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Sheet.Trigger asChild>
        <Button>
          M<span className="sr-only">Toggle Menu</span>
        </Button>
      </Sheet.Trigger>
      <Sheet.Content side="left" className="pr-0">
        <Link
          href="/"
          className={cn(
            headline.variable,
            'hover: prose flex items-center gap-1 font-headline text-lg font-extrabold uppercase text-primary-900 hover:text-primary-700'
          )}
        >
          <Logo className="h-8 w-8" />
          Pattern Analyzer
        </Link>
      </Sheet.Content>
    </Sheet>
  );
};
