import { SquadEntitiy } from './db/types';
import { SquadData } from './types';
import { percentile } from './utils/math.utils';
import { toDate } from './utils/date.utils';
import { toCompositionId } from './xws';

export const toSquadEntitiy = (
  val: SquadData,
  tournament: { date: Date; total: number }
): SquadEntitiy => {
  const xws = val.xws;

  return {
    id: Number(val.id),
    player: val.player,
    date: toDate(tournament.date),
    rank: {
      swiss: val.rank.swiss,
      elimination: val.rank.elimination,
    },
    record: val.record,
    xws: val.xws || undefined,
    faction: xws?.faction ?? 'unknown',
    composition: xws ? toCompositionId(xws) : undefined,
    percentile: percentile(
      val.rank.elimination ?? val.rank.swiss,
      tournament.total
    ),
  };
};
