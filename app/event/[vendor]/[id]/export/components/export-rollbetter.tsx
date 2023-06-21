'use client';

import useClipboard from 'react-use-clipboard';
import useSWR from 'swr';

import { getJson } from '@/lib/utils';
import { Button } from '@/ui';

// Component
// ---------------
export const ExportRollbetter = ({ id }: { id: string }) => {
  const { data, isLoading } = useSWR(`/api/rollbetter/${id}}/export`, getJson);

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
