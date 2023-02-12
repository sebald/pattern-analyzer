'use client';

import { Dialog, Link } from 'components';
import { squadsToCSV } from 'lib/export';
import type { SquadData } from 'lib/types';

export interface ExportDialogProps {
  children: React.ReactNode;
  eventTitle: string;
  squads: SquadData[];
}

export const ExportDialog = ({
  eventTitle,
  squads,
  children,
}: ExportDialogProps) => {
  return (
    <Dialog>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content className="sm:max-w-[425px]">
        <Dialog.Header>
          <Dialog.Title>Export Data</Dialog.Title>
          <Dialog.Description>
            Export crawled data and use it for your own analysis.
          </Dialog.Description>
        </Dialog.Header>
        <div className="grid gap-4 py-4">
          <Link
            variant="button"
            size="regular"
            href={`data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(squads)
            )}`}
            download={`${eventTitle.replace(/\s/g, '_')}.json`}
          >
            Export as JSON
          </Link>
          <Link
            variant="button"
            size="regular"
            href={`data:text/plain;charset=utf-8,${squadsToCSV(squads)}`}
            download={`${eventTitle.replace(/\s/g, '_')}.csv`}
          >
            Export as CSV
          </Link>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};
