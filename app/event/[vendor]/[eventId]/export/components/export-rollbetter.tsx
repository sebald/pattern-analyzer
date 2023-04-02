'use client';

import useClipboard from 'react-use-clipboard';
import useSWR from 'swr';

import { Button } from '@/ui';

import { ExportProps } from './types';

// Component
// ---------------
export const ExportRollbetter = ({ event }: ExportProps) => {
  const { data, isLoading } = useSWR(
    ['/api/rollbetter/export', event.id[0]],
    async ([url, id]) => {
      const res = await fetch(`${url}/${id}`);

      if (!res.ok) {
        throw new Error('Could not fetch export from rollbetter...');
      }

      const json = await res.json();
      return json;
    }
  );

  const [isCopied, setCopied] = useClipboard(JSON.stringify(data || {}), {
    successDuration: 2000,
  });

  return (
    <div className="flex flex-col gap-1">
      <Button
        variant="primary"
        size="large"
        disabled={isLoading}
        onClick={setCopied}
      >
        Export for Listfortress
      </Button>
      <div className="text-center text-xs text-secondary-500">
        {isLoading
          ? 'Fetching data from rollbetter...'
          : isCopied
          ? 'Copied data to your clipboard!'
          : 'Data will be copied to your clipboard!'}
      </div>
    </div>
  );
};
