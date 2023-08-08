import { SquadEntitiy } from './__db';
import { SquadData } from './types';
import { percentile } from './utils';
import { toCompositionId } from './xws';

export const toSquadEntitiy = (
  val: SquadData,
  tournament: { date: Date; total: number }
): SquadEntitiy => {
  const xws = val.xws;

  return {
    id: Number(val.id),
    player: val.player,
    date: tournament.date,
    rank: {
      swiss: val.rank.swiss,
      elimination: val.rank.elimination ?? null,
    },
    record: val.record,
    xws: val.xws,
    faction: xws?.faction ?? 'unknown',
    composition: toCompositionId(xws),
    percentile: percentile(
      val.rank.elimination ?? val.rank.swiss,
      tournament.total
    ),
  };
};
