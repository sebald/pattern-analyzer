'use client';

import useClipboard from 'react-use-clipboard';

import { Button } from '@/ui';
import { eventToListfortress } from '@/lib/export';

import { ExportProps } from './types';

// Component
// ---------------
export const ExportLongshanks = ({ event }: ExportProps) => {
  const listfortressExport =
    event.rounds.length > 0 ? JSON.stringify(eventToListfortress(event)) : '';
  const [isCopied, setCopied] = useClipboard(listfortressExport, {
    successDuration: 2000,
  });

  return (
    <div className="flex flex-col gap-1">
      <Button variant="primary" size="large" onClick={setCopied}>
        Export for Listfortress
      </Button>
      <div className="text-center text-xs text-secondary-500">
        {isCopied
          ? 'Copied data to your clipboard!'
          : 'Data will be copied to your clipboard!'}
      </div>
    </div>
  );
};
