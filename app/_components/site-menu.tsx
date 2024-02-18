'use client';

import { Button } from '@/ui';
import { MagnifyingGlass } from '@/ui/icons';
import { useEffect, useState } from 'react';

export const SiteMenu = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <Button variant="sunken" size="medium" className="flex gap-8">
        <span className="flex items-center gap-1">
          <MagnifyingGlass className="size-4" /> Search...
        </span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-secondary-100 bg-white px-1.5 font-mono text-xs font-medium text-secondary-400 shadow-sm">
          <span>⌘</span>K
        </kbd>
      </Button>
    </>
  );
};
