import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getAllTournaments } from '@/lib/vendor/listfortress';
import { monthsAgo, today } from '@/lib/utils/date.utils';

// Config
// ---------------
export const revalidate = 86_400; // 1 day

// Helpers
// ---------------
const schema = z.object({
  q: z.string().nullable(),
  format: z.union([z.literal('standard'), z.literal('legacy')]).nullable(),
  from: z
    .string()
    .datetime()
    .nullable()
    .transform(val => (val ? new Date(val) : monthsAgo(1))),
  to: z
    .string()
    .datetime()
    .nullable()
    .transform(val => (val ? new Date(val) : today())),
});

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

  const tournaments = await getAllTournaments(result.data);

  return NextResponse.json(tournaments);
};
