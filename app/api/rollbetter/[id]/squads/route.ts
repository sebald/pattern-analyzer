import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import * as rollbetter from '@/lib/vendor/rollbetter';

// Config
// ---------------
export const revalidate = 300; // 5 min

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
  const players = await rollbetter.getPlayerData(id);
  const squads = await rollbetter.getSquadsData(id, players);

  return NextResponse.json(squads);
};
