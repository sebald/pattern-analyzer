'use client';

import { useState, useCallback } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import useSWR from 'swr';

import { getJson } from '@/lib/utils';
import { Button } from '@/ui';

// Component
// ---------------
export const ExportRollbetter = ({ id }: { id: string }) => {
  const { data, isLoading } = useSWR(`/api/rollbetter/${id}}/export`, getJson);

  const [isCopied, setIsCopied] = useState(false);
  const [, copy] = useCopyToClipboard();

  const handleCopy = useCallback(() => {
    copy(JSON.stringify(data || {}));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [data, copy]);

  return (
    <div className="flex flex-col gap-1">
      <Button size="large" disabled={isLoading} onClick={handleCopy}>
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
