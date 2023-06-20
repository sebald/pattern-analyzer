import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import * as listfortress from '@/lib/vendor/listfortress';
import type { SquadData } from '@/lib/types';
import { getBuilderLink, toXWS } from '@/lib/xws';

// Config
// ---------------
export const revalidate = 300; // 5 min

// Helpers
// ---------------
const schema = {
  params: z.object({
    id: z.string().regex(/^[0-9]+$/),
  }),
};

const updateRcord = (
  record: SquadData['record'] = {
    wins: 0,
    ties: 0,
    losses: 0,
  },
  player: number,
  opponent: number
) => {
  const field: keyof SquadData['record'] =
    player > opponent ? 'wins' : player < opponent ? 'losses' : 'ties';

  return {
    ...record,
    [field]: record[field] + 1,
  };
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
  const { participants, rounds } = await listfortress.getTournament(id);
  const records: { [playerId: string]: SquadData['record'] } = {};

  rounds.forEach(round => {
    round.matches.forEach(
      ({ player1_id, player1_points, player2_id, player2_points }) => {
        records[player1_id] = updateRcord(
          records[player1_id],
          player1_points,
          player2_points
        );

        // Buys don't have a second player
        if (player2_id !== undefined) {
          records[player2_id] = updateRcord(
            records[player2_id],
            player2_points,
            player1_points
          );
        }
      }
    );
  });

  const squads = participants
    .map(({ list_json, ...p }) => {
      let xws = null;
      try {
        if (list_json) {
          xws = toXWS(list_json || '');
        }
      } catch {
        console.log(`[listfortress] Failed to parse "list_json": ${list_json}`);
      }

      return {
        id: `${p.id}`,
        player: p.name,
        xws,
        raw: list_json || '',
        url: getBuilderLink(xws),
        rank: {
          swiss: p.swiss_rank,
          elimination: p.top_cut_rank,
        },
        points: p.score,
        record: records[p.id] || {
          wins: 0,
          losses: 0,
          ties: 0,
        },
        sos: Number(p.sos),
        missionPoints: p.mission_points,
        mov: p.mov,
        dropped: p.dropped,
      };
    })
    /**
     * Rollbetter reports people from the waitlist as
     * participants. We remove them by checking some of
     * their stats.
     */
    .filter(p => {
      const games = Object.values(p.record).reduce((acc, n) => n + acc, 0);
      return p.sos > 0 && games > 0;
    }) satisfies SquadData[];

  return NextResponse.json(squads);
};
