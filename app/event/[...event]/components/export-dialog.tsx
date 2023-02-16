'use client';

import useClipboard from 'react-use-clipboard';
import useSWR from 'swr';

import { Alert, Button, Dialog, Divider, Link } from 'components';
import { squadsToCSV, eventToListfortress } from 'lib/export';
import type { EventData } from 'lib/types';

// Helper
// ---------------
interface ExportProps {
  event: EventData;
}

const ExportLongshanks = ({ event }: ExportProps) => {
  const listfortressExport =
    event.rounds.length > 0 ? JSON.stringify(eventToListfortress(event)) : '';
  const [isCopied, setCopied] = useClipboard(listfortressExport, {
    successDuration: 2000,
  });

  return (
    <div className="flex flex-col gap-1">
      <Button variant="primary" onClick={setCopied}>
        Export for Listfortress <sup>BETA</sup>
      </Button>
      <div className="text-center text-xs text-secondary-300">
        {isCopied
          ? 'Copied data to your clipboard!'
          : 'Data will be copied to your clipboard!'}
      </div>
    </div>
  );
};

const ExportRollbetter = ({ event }: ExportProps) => {
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
      <Button variant="primary" disabled={isLoading} onClick={setCopied}>
        Export for Listfortress <sup>BETA</sup>
      </Button>
      <div className="text-center text-xs text-secondary-300">
        {isLoading
          ? 'Fetching data from rollbetter...'
          : isCopied
          ? 'Copied data to your clipboard!'
          : 'Data will be copied to your clipboard!'}
      </div>
    </div>
  );
};

// Props
// ---------------
export interface ExportDialogProps {
  children: React.ReactNode;
  event: EventData;
}

// Component
// ---------------
export const ExportDialog = ({ event, children }: ExportDialogProps) => {
  return (
    <Dialog>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content className="sm:max-w-[425px]">
        <Dialog.Header>
          <Dialog.Title>Export Data</Dialog.Title>
          <Dialog.Description>
            Export data and use it for your own analysis and apps.
          </Dialog.Description>
        </Dialog.Header>
        <div className="grid gap-3 py-4">
          {event.vendor === 'longshanks' ? (
            <ExportLongshanks event={event} />
          ) : (
            <ExportRollbetter event={event} />
          )}
          <Divider className="my-3" />
          <Link
            variant="button"
            size="regular"
            href={`data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(event.squads)
            )}`}
            download={`${event.title.replace(/\s/g, '_')}.json`}
          >
            Download as JSON
          </Link>
          <Link
            variant="button"
            size="regular"
            href={`data:text/plain;charset=utf-8,${squadsToCSV(event.squads)}`}
            download={`${event.title.replace(/\s/g, '_')}.csv`}
          >
            Download as CSV
          </Link>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};
