import { Caption, Link, Title } from 'components';
import { getEventHtml, parseTitle } from 'lib/longshanks';

/**
 * Segment Config (see: https://beta.nextjs.org/docs/api-reference/segment-config)
 */
export const revalidate = 60;
export const fetchCache = 'force-cache';

/**
 * Opt into background revalidation. (see: https://github.com/vercel/next.js/discussions/43085)
 */
export async function generateStaticParams() {
  return [];
}

// Props
// ---------------
export interface PageProps {
  children: React.ReactNode;
  params: {
    event: string;
  };
}

// Page
// ---------------
const Page = async ({ params, children }: PageProps) => {
  const { url, html } = await getEventHtml(params.event);
  const title = parseTitle(html);

  return (
    <main className="p-4">
      <div>
        <Title>{title || `Event #${params.event}`}</Title>
        <Caption>
          <Link href={url}>Event #{params.event}</Link>
        </Caption>
      </div>
      {children}
    </main>
  );
};

export default Page;
