import { toDate } from '@/lib/utils/date.utils';

import { db } from './db';
import type { DateFilter, SquadEntitiy } from './types';

export const getSquads = async (props: DateFilter) => {
  const sq = db.selectFrom('squads').selectAll();
  const tq = db
    .selectFrom('squads')
    .select(eb => [
      eb.fn.count('listfortress_ref').distinct().as('tournaments_count'),
    ]);

  if (props.from) {
    const from =
      typeof props.from === 'string' ? props.from : toDate(props.from);
    sq.where('date', '<=', from);
    tq.where('date', '<=', from);
  }

  if (props.to) {
    const to = typeof props.to === 'string' ? props.to : toDate(props.to);
    sq.where('date', '>=', to);
    tq.where('date', '>=', to);
  }

  const result = await Promise.all([
    sq.execute(),
    tq.executeTakeFirstOrThrow(),
  ]);

  const squads: SquadEntitiy[] = [];
  const count = {
    all: result[0].length,
    rebelalliance: 0,
    galacticempire: 0,
    scumandvillainy: 0,
    resistance: 0,
    firstorder: 0,
    galacticrepublic: 0,
    separatistalliance: 0,
    unknown: 0,
  };

  result[0].forEach(squad => {
    count[squad.faction] += 1;

    squads.push({
      id: squad.id,
      player: squad.player,
      date: new Date(squad.date),
      rank: {
        swiss: squad.swiss,
        elimination: squad.cut,
      },
      record: {
        wins: squad.wins,
        ties: squad.ties,
        losses: squad.losses,
      },
      xws: squad.xws,
      faction: squad.faction,
      composition: squad.composition,
      percentile: Number(squad.percentile),
    });
  });

  return {
    squads,
    meta: {
      tournaments: Number(result[1].tournaments_count),
      count,
    },
  };
};
