'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { siteNavigation } from '@/lib/config';
import data from '@/lib/data/display-values.json';
import { Button, Command } from '@/ui';
import { useHasMounted } from '@/ui/hooks/useHasMounted';
import { MagnifyingGlass } from '@/ui/icons';

const pilots = data.pilot;

// Helpers
// ---------------
const Hotkey = () => {
  const mounted = useHasMounted();

  if (!mounted) {
    return null;
  }

  const modifier = window.navigator.userAgent.includes('Mac') ? (
    <span>⌘</span>
  ) : (
    <>
      <span>Ctrl</span>
      <span>+</span>
    </>
  );

  return (
    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-secondary-100 bg-white px-1.5 font-mono text-xs font-medium text-secondary-400 shadow-sm">
      {modifier}K
    </kbd>
  );
};

// Component
// ---------------
export const SiteMenu = () => {
  const router = useRouter();
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

  const execute = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="sunken"
        size="medium"
        className="flex gap-8"
        onClick={() => setOpen(true)}
      >
        <span className="flex items-center gap-1">
          <MagnifyingGlass className="size-4" /> Search...
        </span>
        <Hotkey />
      </Button>
      <Command.Dialog open={open} onOpenChange={setOpen}>
        <Command.Input placeholder="Type a command or search..." />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group heading="Pages">
            {siteNavigation.map(({ name, href }) => (
              <Command.Item
                key={href}
                value={name}
                onSelect={() => execute(() => router.push(href))}
              >
                {name}
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group heading="Pilots">
            {Object.entries(pilots).map(([id, name]) => (
              <Command.Item
                key={id}
                value={name}
                onSelect={() => execute(() => router.push(`/pilot/${id}`))}
              >
                {name}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command.Dialog>
    </>
  );
};
