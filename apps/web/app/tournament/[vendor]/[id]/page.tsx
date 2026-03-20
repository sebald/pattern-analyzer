import type { Vendor } from '@/lib/types';
import { getVendor } from '@/lib/vendor';

import { Rankings } from './_components/rankings';

// Props
// ---------------
interface PageParams {
  params: Promise<{
    vendor: string;
    id: string;
  }>;
}

// Page
// ---------------
const Page = async ({ params }: PageParams) => {
  const { vendor, id } = await params;
  const squads = await getVendor(vendor as Vendor).getSquads({ id });
  return <Rankings squads={squads} />;
};

export default Page;
