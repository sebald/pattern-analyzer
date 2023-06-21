import { getEventDataByVendor } from '@/lib/get-event';
import { Vendor } from '@/lib/types';

import { RECENT_EVENTS } from '@/app/preload';

import { Filter } from './components/filter';
import { FilterProvider } from './components/context';
import { Squads } from './components/squads';

/**
 * Opt into background revalidation. (see: https://github.com/vercel/next.js/discussions/43085)
 */
export const generateStaticParams = () => RECENT_EVENTS;

// Props
// ---------------
interface PageProps {
  params: {
    vendor: Vendor;
    eventId: string;
  };
}

// Page
// ---------------
const Page = async ({ params }: PageProps) => {
  const event = await getEventDataByVendor({
    vendor: params.vendor,
    ids: params.eventId,
  });

  return (
    <FilterProvider>
      <Filter />
      <Squads squads={event.squads} />
    </FilterProvider>
  );
};

export default Page;
