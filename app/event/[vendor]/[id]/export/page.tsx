import { BASE_URL, RECENT_EVENTS } from '@/lib/env';
import { squadsToCSV } from '@/lib/export';
import type { EventInfo, SquadData, Vendor } from '@/lib/types';
import { Headline, List, Link, Divider, Text } from '@/ui';

// Config
// ---------------
/**
 * Opt into background revalidation. (see: https://github.com/vercel/next.js/discussions/43085)
 */
export const generateStaticParams = () => RECENT_EVENTS;

// Props
// ---------------
interface PageProps {
  params: {
    vendor: Vendor;
    id: string;
  };
}

// Data
// ---------------
const getEventInfo = async ({ vendor, id }: PageProps['params']) => {
  const res = await fetch(`${BASE_URL}/api/${vendor}/${id}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch event info... (${vendor}/${id})`);
  }

  const info = await res.json();
  return info as EventInfo;
};

const getSquads = async ({ vendor, id }: PageProps['params']) => {
  const res = await fetch(`${BASE_URL}/api/${vendor}/${id}/squads`);

  if (!res.ok) {
    throw new Error(`Failed to fetch squdas... (${vendor}/${id})`);
  }

  const squads = await res.json();
  return squads as SquadData[];
};

// Page
// ---------------
const Page = async ({ params }: PageProps) => {
  const { name } = await getEventInfo(params);

  if (params.vendor === 'longshanks') {
    return 'TODO...';
  }

  const squads = await getSquads(params);
  return (
    <div className="grid grid-cols-12 gap-y-14 md:gap-y-8">
      <div className="col-span-full md:col-span-4">
        BUT THE EXPORT BUTTON HERE!
      </div>
      <div className="col-span-full px-4 md:col-span-7 md:col-start-6 md:px-0">
        {params.vendor === 'listfortress' ? (
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
            JSON.stringify(squads)
          )}`}
          download={`${name.replace(/\s/g, '_')}.json`}
        >
          Download as JSON
        </Link>
        <Link
          variant="button"
          size="large"
          className="w-full md:w-auto"
          target="_blank"
          href={`data:text/plain;charset=utf-8,${squadsToCSV(squads)}`}
          download={`${name.replace(/\s/g, '_')}.csv`}
        >
          Download as CSV
        </Link>
      </div>
    </div>
  );
};

export default Page;
