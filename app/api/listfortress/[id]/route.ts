import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import * as listfortress from '@/lib/vendor/listfortress';

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
  const { name, date } = await listfortress.getTournament(id);
  const event = {
    name,
    date,
    url: `https://listfortress.com/tournaments/${id}`,
    vendor: 'listfortress',
  };

  return NextResponse.json(event);
};
