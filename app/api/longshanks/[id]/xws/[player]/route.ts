import { load } from 'cheerio';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import type { XWSData } from '@/lib/types';
import { getBuilderLink, toXWS } from '@/lib/xws';
import { xwsFromText } from '@/lib/yasb';

// Config
// ---------------
export const revalidate = 86_400; // 1 day

const schema = z.object({
  id: z.string().regex(/^[0-9]+$/),
  player: z.string().regex(/^[0-9]+$/),
});

const getXWS = (raw: string) => {
  // Remove new lines, makes it easier to regex on it
  const val = raw.replace(/(\r\n|\n|\r)/gm, '');

  // XWS
  if (raw.startsWith('{')) {
    try {
      const xws = toXWS(raw);
      return {
        xws,
        url: getBuilderLink(xws),
      };
    } catch {
      /**
       * If there is an error parsing JSON,
       * try the other options.
       */
    }
  }

  // YASB
  return xwsFromText(val);
};

// Props
// ---------------
export interface RouteContext {
  params: {
    event?: string;
    id?: string;
  };
}

// Handler
// ---------------
export const GET = async (_: NextRequest, { params }: RouteContext) => {
  const result = schema.safeParse(params);

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

  const { id, player } = result.data;

  const res = await fetch(
    `https://longshanks.org/admin/events/player_info.php?event=${id}&player=${player}`
  );

  if (!res.ok) {
    return NextResponse.json(
      {
        name: 'Fetch Error',
        message: `Failed to fetch player ${player} for event ${id}, got a ${res.status}.`,
      },
      {
        status: 500,
      }
    );
  }

  const html = await res.text();
  const $ = load(html);
  const raw = $('[id^=list_]').attr('value') || '';
  const { url, xws } = getXWS(raw);

  return NextResponse.json({
    id: player,
    url,
    xws,
    raw,
  } satisfies XWSData);
};
