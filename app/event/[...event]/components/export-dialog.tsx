'use client';

import { useState } from 'react';
import useClipboard from 'react-use-clipboard';
import useSWR from 'swr';

import { Button, Dialog, Link, Message } from '@/components';
import { squadsToCSV, eventToListfortress } from '@/lib/export';
import type { EventData } from '@/lib/types';

// Helper
// ---------------
interface ExportProps {
  event: EventData;
  onCopy: () => void;
}

export const GoToListfortress = () => (
  <Message>
    <Message.Title>Hey there!</Message.Title>
    Since you copied the data for Lisfortress, maybe you want to go there and
    add the event!
    <Message.Footer>
      <Message.Link
        href="http://listfortress.com/tournaments/new"
        target="_blank"
      >
        Go to Listfortress
      </Message.Link>
    </Message.Footer>
  </Message>
);

const ExportLongshanks = ({ event, onCopy }: ExportProps) => {
  const listfortressExport =
    event.rounds.length > 0 ? JSON.stringify(eventToListfortress(event)) : '';
  const [isCopied, setCopied] = useClipboard(listfortressExport, {
    successDuration: 2000,
  });
  const handleCopy = () => {
    setCopied();
    onCopy();
  };

  return (
    <div className="flex flex-col gap-1">
      <Button variant="primary" onClick={handleCopy}>
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

const ExportRollbetter = ({ event, onCopy }: ExportProps) => {
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
  const handleCopy = () => {
    setCopied();
    onCopy();
  };

  return (
    <div className="flex flex-col gap-1">
      <Button variant="primary" disabled={isLoading} onClick={handleCopy}>
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
  const [isCopied, setIsCopied] = useState(false);
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
        <div className="grid gap-3 pt-4">
          {event.id.length > 1 ? (
            <Message>
              <Message.Title>Where is the Listfortress Export!?</Message.Title>
              Export for Listfortress is not availble for multiple events.
            </Message>
          ) : event.vendor === 'longshanks' ? (
            <ExportLongshanks event={event} onCopy={() => setIsCopied(true)} />
          ) : (
            <ExportRollbetter event={event} onCopy={() => setIsCopied(true)} />
          )}
          {isCopied && <GoToListfortress />}
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
