import type { Vendor } from '@/lib/types';
import { getVendor } from '@/lib/vendor';

import { SquadsView } from './_components/squad.view';

/**
 * Opt into background revalidation. (see: https://github.com/vercel/next.js/discussions/43085)
 */
export const generateStaticParams = () => [];

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
  return <SquadsView squads={squads} />;
};

export default Page;
