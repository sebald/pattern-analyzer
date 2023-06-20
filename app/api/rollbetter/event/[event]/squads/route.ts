import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import * as rollbetter from '@/lib/vendor/rollbetter';

// Config
// ---------------
export const revalidate = 300; // 5 min

const schema = {
  params: z.object({
    event: z.string().regex(/^[0-9]+$/),
  }),
};

// Props
// ---------------
interface RouteContext {
  params: {
    event?: string;
  };
}

export const GET = async (request: NextRequest, { params }: RouteContext) => {
  const event = schema.params.safeParse(params);

  if (!event.success) {
    return NextResponse.json(
      {
        name: 'Error parsing input.',
        message: event.error.issues,
      },
      {
        status: 400,
      }
    );
  }

  const id = event.data.event;
  const players = await rollbetter.getPlayerData(id);
  const squads = await rollbetter.getSquadsData(id, players);

  return NextResponse.json(squads);
};
