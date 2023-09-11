import { load, Element } from 'cheerio';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import type { GameRecord } from '@/lib/types';

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

// Helper
// ---------------
const getEventSection = async (
  id: string,
  section: 'player' | 'player_cut'
) => {
  const res = await fetch(
    `https://longshanks.org/events/detail/panel_standings.php?event=${id}&section=${section}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch section data... (${id}, ${section})`);
  }

  return await res.text();
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

  const { id } = event.data;

  // Fetch partial HTML
  const [playerHtml, cutHtml] = await Promise.all([
    getEventSection(id, 'player'),
    getEventSection(id, 'player_cut'),
  ]);
  const $ = load(playerHtml);

  // Helpers
  const getPlayerId = (el: Element) =>
    $('.id_number', el).first().text().replace('#', '');
  const getRankingInfo = (el: Element) => {
    const groups = $('.rank', el.parent)
      .first()
      .text()
      .trim()
      .match(/^(?<rank>\d+)(\s*\((?<info>[a-z]+))?/)?.groups || {
      rank: 0,
      info: '',
    };
    return {
      rank: Number(groups.rank),
      dropped: groups.info === 'drop',
    };
  };
  const combineRecords = (swiss: GameRecord, cut?: GameRecord) =>
    ({
      wins: swiss.wins + (cut?.wins || 0),
      ties: swiss.ties + (cut?.ties || 0),
      losses: swiss.losses + (cut?.losses || 0),
    }) satisfies GameRecord;

  // Cut data
  const cut = new Map<string, { rank: number; record: GameRecord }>();
  load(cutHtml)('.player .data')
    .toArray()
    .map(el => {
      const id = getPlayerId(el);
      const { rank } = getRankingInfo(el);
      const record = {
        wins: Number($('.wins', el).first().text().trim()),
        ties: Number($('.ties', el).first().text().trim()),
        losses: Number($('.loss', el).first().text().trim()),
      };
      cut.set(id, { rank, record });
    });

  // Swiss data and merge with cut data
  const players = $('.player .data')
    .toArray()
    .map(el => {
      const id = getPlayerId(el);
      const player = $('.player_link', el).first().text();

      const { rank: swiss, dropped } = getRankingInfo(el);
      const cutInfo = cut.get(id);

      const points = Number($('.stat.mono.skinny.desktop', el).first().text());
      const record = {
        wins: Number($('.wins', el).first().text().trim()),
        ties: Number($('.ties', el).first().text().trim()),
        losses: Number($('.loss', el).first().text().trim()),
      };

      const stats = $('.stat.mono table td', el);
      const sos = Number(stats.first().text().trim());
      const missionPoints = Number(stats.eq(1).text().trim());
      const mov = Number(stats.eq(2).text().trim());

      return {
        id,
        player,
        rank: {
          swiss,
          elimination: cutInfo?.rank,
        },
        points,
        record: combineRecords(record, cutInfo?.record),
        sos,
        missionPoints,
        mov,
        dropped,
      };
    });

  return NextResponse.json(players);
};
