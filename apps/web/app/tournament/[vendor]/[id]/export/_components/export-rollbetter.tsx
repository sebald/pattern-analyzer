'use client';

import useSWR from 'swr';

import { getJson } from '@/lib/utils/fetch.utils';
import { CopyButton } from '@/ui/copy-button';

// Component
// ---------------
export const ExportRollbetter = ({ id }: { id: string }) => {
  const { data, isLoading } = useSWR(`/api/rollbetter/${id}}/export`, getJson);

  return (
    <div className="flex flex-col gap-1">
      <CopyButton
        size="large"
        disabled={isLoading}
        content={JSON.stringify(data || {})}
      >
        Export for Listfortress
      </CopyButton>
      <div className="text-center text-xs text-secondary-500">
        {isLoading
          ? 'Fetching data from rollbetter...'
          : 'Data will be copied to your clipboard!'}
      </div>
    </div>
  );
};
