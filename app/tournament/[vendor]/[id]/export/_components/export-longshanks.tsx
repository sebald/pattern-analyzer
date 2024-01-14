'use client';

import useClipboard from 'react-use-clipboard';

import { Button } from '@/ui';
import { useLongshanksExport } from '@/lib/useLongshanksExport';

// Component
// ---------------
export const ExportLongshanks = ({ id }: { id: string }) => {
  const { data: listfortressExport, isLoading } = useLongshanksExport({ id });

  const [isCopied, setCopied] = useClipboard(
    listfortressExport ? JSON.stringify(listfortressExport) : '',
    {
      successDuration: 2000,
    }
  );

  return (
    <div className="flex flex-col gap-1">
      <Button size="large" disabled={isLoading} onClick={setCopied}>
        Export for Listfortress
      </Button>
      <div className="text-center text-xs text-secondary-500">
        {isLoading
          ? 'Generating export...'
          : isCopied
          ? 'Copied data to your clipboard!'
          : 'Data will be copied to your clipboard!'}
      </div>
    </div>
  );
};
