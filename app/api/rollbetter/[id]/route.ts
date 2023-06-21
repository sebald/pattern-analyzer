import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Config
// ---------------
export const revalidate = 86_400; // 1 day

// Helpers
// ---------------
const schema = {
  params: z.object({
    id: z.string().regex(/^[0-9]+$/),
  }),
};

export interface RollBetterTournament {
  id: number;
  title: string;
  startDate: string;
  endDate: string | null;
  timezone: string;
  description: string;
  registrationCount: number;
  rounds: {
    id: number;
    roundNumber: number;
    cutSize: number | null;
    startState: string;
    startTime: any;
    endTime: any;
    startDate: any;
    endDate: any;
    type: 'Swiss' | 'Graduated Cut';
  }[];
  // there is more but this is all we need for now
}

const getTournament = async (id: string) => {
  const api_url = `https://rollbetter-linux.azurewebsites.net/tournaments/${id}`;
  const res = await fetch(api_url);

  if (!res.ok) {
    throw new Error(`[rollbetter] Failed to fetch event data... (${id})`);
  }

  const { title, startDate }: RollBetterTournament = await res.json();

  return { name: title, date: startDate };
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
    id,
    name,
    date,
    url: `https://rollbetter.gg/tournaments/${id}`,
    vendor: 'rollbetter',
  };

  return NextResponse.json(event);
};
