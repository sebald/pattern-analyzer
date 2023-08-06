import { ListfortressRound, Scenarios } from '@/lib/types';
import { load } from 'cheerio';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Config
// ---------------
export const revalidate = 3600; // 1 hour

// Helpers
// ---------------
const schema = z.object({
  id: z.string().regex(/^[0-9]+$/),
});

// Helpers
// ---------------
const getAllRounds = async (id: string) => {
  const url = `https://longshanks.org/events/detail/?event=${id}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch event data... (${id})`);
  }

  const html = await res.text();

  try {
    const { args } = html.match(
      /load\("\/events\/detail\/games\/round\.php\?(?<args>.*)\)/
    )!.groups!;

    // Get round and cut number from args (cut is optional)
    const { swiss, cut } = args.match(
      /(?<swiss>\d+)(&cut=(?<cut>\d+))?\s#games/
    )!.groups!;
    return {
      swiss: Number(swiss),
      cut: Number(cut) || 0,
    };
  } catch {
    console.log('Oh noes... the round info regex does not work anymore!');
    return { swiss: 0, cut: 0 };
  }
};

const getEventRounds = async (
  id: string,
  info: { swiss: number; cut: number }
) => {
  const allRounds = [
    ...Array.from({ length: info.swiss }, (_, i) => i + 1),
    ...Array.from({ length: info.cut }, (_, i) => (i + 1) * -1),
  ];
  const result = await Promise.all(
    allRounds.map(async round => {
      const res = await fetch(
        `https://longshanks.org/events/detail/games/round.php?event=${id}&round=${round}&rounds=${info.swiss}&cut=${info.cut}`
      );

      if (!res.ok) {
        throw new Error('Failed to fetch round from longshanks...');
      }

      return res.text();
    })
  );

  return result.map(
    (html, idx) =>
      ({
        type: allRounds[idx] > 0 ? 'swiss' : 'elimination',
        number: Math.abs(allRounds[idx]),
        html,
      }) as const
  );
};

/**
 * Iterate over all the popups to find the games played by each player.
 */
const parseRounds = async (
  id: string,
  info: { swiss: number; cut: number }
) => {
  const rounds = await getEventRounds(id, info);

  return rounds.map(({ type, number, html }) => {
    const $ = load(html);
    const games = $('.game');

    /**
     * Get scenario from first game. We except the same
     * scenario is played in each game of the round.
     */
    const scenario = games
      .first()
      .find('.details:last-child')
      .find('.item')
      .children()
      .last()
      .text()
      .trim() as Scenarios;

    const matches = games.toArray().map(game => {
      // Ids of the players playing against each other
      const ids = $('.results .player .id_number', game)
        .toArray()
        .map(pid => $(pid).text().replace('#', ''));
      // Player names
      const players = $('.results .player .player_link', game)
        .toArray()
        .map(p => $(p).text().trim());
      const score = $('.results .player .score', game)
        .toArray()
        .map(pid => Number($(pid).text()));

      return {
        player1: players[0],
        'player1-id': ids[0],
        player1points: score[0],
        player2: players[1] || '-',
        'player2-id': ids[1],
        player2points: score[1],
      };
    });

    return {
      'round-type': type,
      'round-number': number,
      matches,
      scenario,
    } satisfies ListfortressRound;
  });
};

// Props
// ---------------
export interface RouteContext {
  params: {
    id?: string;
  };
}

// Handler
// ---------------
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

  const url = `https://longshanks.org/events/detail/?event=${id}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch event data... (${id})`);
  }

  const allRounds = await getAllRounds(id);
  const rounds = await parseRounds(id, allRounds);

  return NextResponse.json(rounds);
};
