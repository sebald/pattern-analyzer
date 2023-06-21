import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { ListfortressTournament } from '@/lib/types';

// Helpers
// ---------------
const schema = {
  params: z.object({
    id: z.string().regex(/^[0-9]+$/),
  }),
};

export const getTournament = async (id: string) => {
  const api_url = `https://listfortress.com/api/v1/tournaments/${id}`;
  const res = await fetch(api_url);

  if (!res.ok) {
    throw new Error(`[listfortress] Failed to fetch event data... (${id})`);
  }

  const tournament: ListfortressTournament = await res.json();
  return tournament;
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
  const { name, date } = await getTournament(id);
  const event = {
    name,
    date,
    url: `https://listfortress.com/tournaments/${id}`,
    vendor: 'listfortress',
  };

  return NextResponse.json(event);
};
