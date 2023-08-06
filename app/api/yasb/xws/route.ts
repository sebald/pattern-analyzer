import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { yasb2xws } from '@/lib/yasb';

// Config
// ---------------
export const revalidate = 'force-cache';
export const fetchCache = 'force-cache';

// Helpers
// ---------------
const schema = z.object({
  f: z.string(),
  d: z.string(),
  sn: z.string(),
  obs: z.string().optional(),
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

  const xws = yasb2xws(result.data);
  return NextResponse.json(xws, { status: 200 });
};
