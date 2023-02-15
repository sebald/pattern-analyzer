'use client';

import useClipboard from 'react-use-clipboard';

import { Button, Dialog, Divider, Link } from 'components';
import { squadsToCSV, eventToListfortress } from 'lib/export';
import type { EventData } from 'lib/types';

export interface ExportDialogProps {
  children: React.ReactNode;
  event: EventData;
}

export const ExportDialog = ({ event, children }: ExportDialogProps) => {
  const [isCopied, setCopied] = useClipboard(
    JSON.stringify(eventToListfortress(event)),
    {
      successDuration: 2000,
    }
  );

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
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Button variant="primary" onClick={setCopied}>
              Export for Listfortress <sup>BETA</sup>
            </Button>
            <div className="text-center text-xs text-secondary-300">
              {isCopied
                ? 'Copied data to your clipboard!'
                : 'Data will be copied to your clipboard!'}
            </div>
          </div>
          <Divider />
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
