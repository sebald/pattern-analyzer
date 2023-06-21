import { squadsToCSV } from '@/lib/export';
import type { EventData } from '@/lib/types';
import { Headline, List, Link, Divider, Text } from '@/ui';

import { ExportListfortress } from './components/export-listfortress';
import { ExportLongshanks } from './components/export-longshanks';
import { ExportRollbetter } from './components/export-rollbetter';

const EXPORT_COMPONENT = {
  listfortress: ExportListfortress,
  longshanks: ExportLongshanks,
  rollbetter: ExportRollbetter,
};

export interface ExportViewProps {
  event: EventData;
}

export const ExportView = ({ event }: ExportViewProps) => {
  const Export = EXPORT_COMPONENT[event.vendor];

  return (
    <div className="grid grid-cols-12 gap-y-14 md:gap-y-8">
      <div className="col-span-full md:col-span-4">
        <Export event={event} />
      </div>
      <div className="col-span-full px-4 md:col-span-7 md:col-start-6 md:px-0">
        {event.vendor === 'listfortress' ? (
          <>
            <Headline level="3" font="inherit" className="font-medium">
              Listfortress Export
            </Headline>
            <Text>
              The data for this event is already obtained directly from
              Listfortress.
              <br />
              No need to upload the event Listfortress again.
            </Text>
          </>
        ) : (
          <>
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
          </>
        )}
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
          target="_blank"
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
          target="_blank"
          href={`data:text/plain;charset=utf-8,${squadsToCSV(event.squads)}`}
          download={`${event.title.replace(/\s/g, '_')}.csv`}
        >
          Download as CSV
        </Link>
      </div>
    </div>
  );
};
