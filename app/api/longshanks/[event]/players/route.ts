import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { parsePlayerInfo, parseSquads } from '@/lib/longshanks';

interface RouteContext {
  params: {
    event?: string;
  };
}

const schema = z.object({
  event: z.string().regex(/^[0-9]+$/),
});

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

  const id = result.data.event;

  const players = await parsePlayerInfo(id);
  const squads = await parseSquads(id, players);

  return NextResponse.json(squads);
};
