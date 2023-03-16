import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export interface RouteContext {
  params: {
    id?: string;
  };
}

const schema = z.object({
  id: z.string().regex(/^[0-9]+$/),
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

  const { id } = result.data;
  const rollbetter = await fetch(
    `https://rollbetter-linux.azurewebsites.net/tournaments/${id}/list-fortress-json`
  );

  if (!rollbetter.ok) {
    return NextResponse.json(
      {
        name: 'Proxy Error',
        message: `Got a ${rollbetter.status} from rollbetter.`,
      },
      {
        status: 500,
      }
    );
  }

  const json = await rollbetter.json();
  return NextResponse.json(json);
};
