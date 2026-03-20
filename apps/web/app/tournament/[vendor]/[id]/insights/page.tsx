import type { Vendor } from '@/lib/types';
import { getVendor } from '@/lib/vendor';

import { StatsView } from './_components/stats.view';

/**
 * Opt into background revalidation. (see: https://github.com/vercel/next.js/discussions/43085)
 */
export const generateStaticParams = () => [];

// Props
// ---------------
interface PageProps {
  params: Promise<{
    vendor: string;
    id: string;
  }>;
}

// Components
// ---------------
const Page = async ({ params }: PageProps) => {
  const { vendor, id } = await params;
  const squads = await getVendor(vendor as Vendor).getSquads({ id });
  return <StatsView squads={squads} />;
};

export default Page;
