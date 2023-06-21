import { BASE_URL, RECENT_EVENTS } from '@/lib/env';
import { squadsToCSV } from '@/lib/export';
import { SquadData, Vendor } from '@/lib/types';
import { Message, Headline, Divider, Link, List, Text } from '@/ui';
import { ExportView } from './(views)/export.view';

// Config
// ---------------
/**
 * Opt into background revalidation. (see: https://github.com/vercel/next.js/discussions/43085)
 */
export const generateStaticParams = () => RECENT_EVENTS;

// Data
// ---------------
interface GetEventProps {
  vendor: Vendor;
  id: string;
}

const getEvent = async ({ vendor, id }: GetEventProps) => {
  const res = await fetch(`${BASE_URL}/api/${vendor}/${id}/squads`);

  if (!res.ok) {
    throw new Error(`Failed to fetch squdas... (${vendor}/${id})`);
  }

  const squads = await res.json();
  return squads as SquadData[];
};

// Props
// ---------------
interface PageProps {
  params: {
    vendor: Vendor;
    id: string;
  };
}

// Page
// ---------------
const Page = async ({ params }: PageProps) => {
  if (params.vendor === 'longshanks') {
    return 'TODO...';
  }

  const event = await getEvent({
    vendor: params.vendor,
    id: params.id,
  });
  return <ExportView event={event} />;
};

export default Page;
