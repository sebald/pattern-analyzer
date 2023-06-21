import { load } from 'cheerio';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Config
// ---------------
export const revalidate = 86_400; // 1 day

// Helpers
// ---------------
const schema = {
  params: z.object({
    id: z.string().regex(/^[0-9]+$/),
  }),
};

// Props
// ---------------
interface RouteContext {
  params: {
    id?: string;
  };
}

// Handler
// ---------------
export const GET = async (_: NextRequest, { params }: RouteContext) => {
  const result = schema.params.safeParse(params);

  if (!result.success) {
    return NextResponse.json(
      {
        name: 'Error parsing input.',
        message: result.error.issues,
      },
      {
        status: 400,
      }
    );
  }

  const { id } = result.data;
  const url = `https://longshanks.org/events/detail/?event=${id}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`[longshanks] Failed to fetch event data... (${id})`);
  }

  const html = await res.text();
  const $ = load(html);

  const name =
    $('head meta[property=og:title]').attr('content') || 'Unknown Event';
  const description =
    $('head meta[property=og:description]').attr('content') || '•';
  const [date] = description.split('•');

  const event = {
    name,
    date: date.trim(),
    url: `https://longshanks.org/events/detail/?event=${id}`,
    vendor: 'longshanks',
  };

  return NextResponse.json(event);
};
