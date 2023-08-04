import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Helpers
// ---------------
const schema = {
  params: z.object({
    token: z.string(),
  }),
};

// Props
// ---------------
interface RouteContext {
  params: {
    token?: string;
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

  const { token } = result.data;

  if (token !== process.env.SYNC_TOKEN) {
    return NextResponse.json(
      {
        name: 'Nope...',
        message: 'ಠ_ಠ U no syncing!',
      },
      {
        status: 401,
      }
    );
  }
};
