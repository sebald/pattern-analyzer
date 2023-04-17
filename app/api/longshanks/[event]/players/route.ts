import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { parsePlayerInfo, parseSquads } from '@/lib/longshanks';

// Config
// ---------------
export const revalidate = 86_400; // 1 day

const schema = {
  params: z.object({
    event: z.string().regex(/^[0-9]+$/),
  }),
  searchParams: z.object({
    page: z
      .string()
      .regex(/^[0-9]+$/)
      .nullable()
      .transform(val => (val === null ? 1 : Number(val))),
    size: z
      .string()
      .regex(/^[0-9]+$/)
      .nullable()
      .transform(val => (val === null ? 50 : Number(val))),
  }),
};

const paginate = <T extends any[]>(
  items: T,
  { page, size }: { page: number; size: number }
) => items.slice(size * (page - 1), size * page);

// Props
// ---------------
interface RouteContext {
  params: {
    event?: string;
  };
}

// Handler
// ---------------
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

  // Pagination
  const { searchParams } = new URL(request.url);
  const pagination = schema.searchParams.safeParse({
    page: searchParams.get('page'),
    size: searchParams.get('size'),
  });

  if (!pagination.success) {
    return NextResponse.json(
      {
        name: 'Error parsing input.',
        message: pagination.error.issues,
      },
      {
        status: 400,
      }
    );
  }

  const id = event.data.event;

  const players = await parsePlayerInfo(id);
  const squads = await parseSquads(id, paginate(players, pagination.data));

  return NextResponse.json(squads);
};
