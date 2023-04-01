import { getEventDataByVendor } from '@/lib/get-event';
import { Vendor } from '@/lib/types';

import { Filter } from './components/filter';
import { FilterProvider } from './components/context';
import { Squads } from './components/squads';

// Props
// ---------------
interface PageProps {
  params: {
    vendor: Vendor;
    eventId: string;
  };
}

// Components
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
