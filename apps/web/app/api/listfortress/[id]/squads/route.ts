import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getSquads } from '@/lib/vendor/listfortress';

// Config
// ---------------
export const revalidate = false;
export const fetchCache = 'force-cache';

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
  params: Promise<{
    id?: string;
  }>;
}

// Handler
// ---------------
export const GET = async (_: NextRequest, { params }: RouteContext) => {
  const resolvedParams = await params;
  const result = schema.params.safeParse(resolvedParams);

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

  const squads = await getSquads(result.data);

  return NextResponse.json(squads);
};
