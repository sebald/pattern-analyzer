'use client';

import { CopyButton } from '@/ui/copy-button';

// Component
// ---------------
export const ExportRollbetter = ({ data }: { data: unknown }) => {
  return (
    <div className="flex flex-col gap-1">
      <CopyButton
        size="large"
        content={JSON.stringify(data || {})}
      >
        Export for Listfortress
      </CopyButton>
      <div className="text-center text-xs text-secondary-500">
        Data will be copied to your clipboard!
      </div>
    </div>
  );
};
