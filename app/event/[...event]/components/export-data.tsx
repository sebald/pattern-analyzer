'use client';

import type { EventData } from '@/lib/types';
import {
  Button,
  Card,
  Divider,
  Headline,
  Link,
  List,
  Message,
} from '@/components';
import { eventToListfortress, squadsToCSV } from '@/lib/export';
import useClipboard from 'react-use-clipboard';
import useSWR from 'swr';

export interface ExportProps {
  event: EventData;
}

// Export: Longshanks
// ---------------
const ExportLongshanks = ({ event }: ExportProps) => {
  const listfortressExport =
    event.rounds.length > 0 ? JSON.stringify(eventToListfortress(event)) : '';
  const [isCopied, setCopied] = useClipboard(listfortressExport, {
    successDuration: 2000,
  });

  return (
    <div className="flex flex-col gap-1">
      <Button variant="primary" size="large" onClick={setCopied}>
        Export for Listfortress
      </Button>
      <div className="text-center text-xs text-secondary-500">
        {isCopied
          ? 'Copied data to your clipboard!'
          : 'Data will be copied to your clipboard!'}
      </div>
    </div>
  );
};

// Export: Rollbetter
// ---------------
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

// Props
// ---------------
export interface ExportProps {
  event: EventData;
}

// Component
// ---------------
export const Export = ({ event }: ExportProps) => {
  if (event.id.length > 1) {
    return (
      <Message variant="warning" size="large">
        <Message.Title>Where is the Listfortress Export!?</Message.Title>
        Export for Listfortress is not availble if displaying multiple events.
      </Message>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-12 gap-y-14 md:gap-y-8">
        <div className="col-span-full md:col-span-4">
          {event.vendor === 'longshanks' ? (
            <ExportLongshanks event={event} />
          ) : (
            <ExportRollbetter event={event} />
          )}
        </div>
        <div className="col-span-full px-4 md:col-span-7 md:col-start-6 md:px-0">
          <Headline level="3" font="inherit" className="font-medium">
            How to upload an event to Listfortress
          </Headline>
          <List enumeration="decimal">
            <List.Item className="prose">
              Press on the &quot;Export for Listfortress&quot; button to copy
              the data to your clipboard.
            </List.Item>
            <List.Item className="prose">
              Go to{' '}
              <Link
                href="http://listfortress.com/tournaments/new"
                target="_blank"
              >
                Listfortress
              </Link>{' '}
              and fill out the form with your tournament data.
            </List.Item>
            <List.Item className="prose">
              Use the second option to add player and round data called
              &quot;Paste an export from RollBetter.gg&quot;. Past the
              previously copied data into the field.
            </List.Item>
            <List.Item className="prose">
              Press the &quot;Create Tournament&quot; button to add your
              tournament. And you are done!
            </List.Item>
          </List>
        </div>
        <Divider className="col-span-full" />
        <div className="col-span-4 md:self-center">
          <Headline level="3" className="pb-0 text-right">
            Other Options:
          </Headline>
        </div>
        <div className="col-span-7 col-start-6 flex flex-col items-center gap-6 md:flex-row">
          <Link
            variant="button"
            size="large"
            className="w-full md:w-auto"
            href={`data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(event.squads)
            )}`}
            download={`${event.title.replace(/\s/g, '_')}.json`}
          >
            Download as JSON
          </Link>
          <Link
            variant="button"
            size="large"
            className="w-full md:w-auto"
            href={`data:text/plain;charset=utf-8,${squadsToCSV(event.squads)}`}
            download={`${event.title.replace(/\s/g, '_')}.csv`}
          >
            Download as CSV
          </Link>
        </div>
      </div>
    </div>
  );
};
