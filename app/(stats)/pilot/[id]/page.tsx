import { getPilotName } from '@/lib/get-value';
import { createMetadata } from '@/lib/metadata';

// Config
// ---------------
export const revalidate = 21600; // 6 hours

/**
 * Opt into background revalidation. (see: https://github.com/vercel/next.js/discussions/43085)
 */
export const generateStaticParams = async () => {
  // TODO
  return [];
};

// Props
// ---------------
interface PageProps {
  params: {
    id: string;
  };
}

// Metadata
// ---------------
export const generateMetadata = ({ params }: PageProps) => {
  const pilot = getPilotName(params.id) || params.id;
  return createMetadata({
    title: pilot,
    description: `Statistics and other data for ${pilot}`,
    ogTitle: pilot,
  });
};

// Data
// ---------------
const getPilotStats = async (pilot: string, from: Date) => {
  // const [squads, count] = await Promise.all([
  //   getSquads({ from, pilot }),
  //   getFactionCount({ from }),
  // ]);
};

// Page
// ---------------
const Page = async ({ params }: PageProps) => {
  return <div>{params.id}</div>;
};

export default Page;
