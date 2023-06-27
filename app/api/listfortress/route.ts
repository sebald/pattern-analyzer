import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import type { ListfortressTournamentInfo } from '@/lib/types';

// Config
// ---------------
export const revalidate = 86_400; // 1 day

// Helpers
// ---------------
const schema = z.object({
  q: z.string().optional().nullable(),
  from: z
    .string()
    .datetime()
    .nullable()
    .transform(val =>
      val
        ? new Date(val)
        : new Date(new Date().setDate(new Date().getDate() - 30))
    ),
  to: z
    .string()
    .datetime()
    .nullable()
    .transform(val => (val ? new Date(val) : new Date())),
});

const getAllTournaments = async () => {
  const api_url = 'https://listfortress.com/api/v1/tournaments/';
  const res = await fetch(api_url);

  if (!res.ok) {
    throw new Error('[listfortress] Failed to fetch events...');
  }

  const tournament: ListfortressTournamentInfo[] = await res.json();
  return tournament;
};

// Handler
// ---------------
export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const result = schema.safeParse(
    Object.keys(schema.shape).reduce((o, key) => {
      o[key] = searchParams.get(key);
      return o;
    }, {} as any)
  );

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

  const filter = result.data;
  const tournaments = await getAllTournaments();

  const data = tournaments.filter(t => {
    // Includes given name
    if (
      filter.q &&
      !t.name.toLocaleLowerCase().includes(filter.q.toLocaleLowerCase())
    ) {
      return false;
    }

    // Was held in given time frame
    const date = new Date(t.date);
    return date >= filter.from && date <= filter.to;
  });

  return NextResponse.json(data);
};
