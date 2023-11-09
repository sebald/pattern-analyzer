import { getAllTournaments, getSquads } from '@/lib/vendor/listfortress';
import { percentile } from '@/lib/utils';
import { toCompositionId, normalize } from '@/lib/xws';

import { addSquads } from './squads';
import { getLastSync, setLastSync } from './system';
import { addTournaments } from './tournaments';

export const sync = async (date: Date) => {
  // Find new tournaments
  const tournaments = await getAllTournaments({
    created_after: date,
    format: 'standard',
  }).then(result =>
    result.map(({ id, name, date }) => ({
      listfortress_ref: id,
      name,
      date,
    }))
  );

  if (tournaments.length === 0) {
    const a = await getLastSync();
    console.log(a);
    await setLastSync();
    const b = await getLastSync();
    console.log(b);
    return {
      name: 'Sync Complete!',
      message: 'Already up to date!',
    };
  }

  // Add new tournaments
  await addTournaments(tournaments);

  // Find new squads + add
  let squadCount = 0;
  await Promise.all(
    tournaments.map(async tournament => {
      const squads = await getSquads({
        id: `${tournament.listfortress_ref}`,
      });
      squadCount += squads.length;

      return addSquads(
        squads.map(squad => ({
          listfortress_ref: tournament.listfortress_ref,
          composition: squad.xws ? toCompositionId(squad.xws) : undefined,
          faction: squad.xws?.faction ?? 'unknown',
          player: squad.player,
          date: tournament.date,
          xws: squad.xws
            ? JSON.stringify(normalize(squad.xws)) || undefined
            : undefined,
          wins: squad.record.wins,
          ties: squad.record.ties,
          losses: squad.record.losses,
          record: JSON.stringify(squad.record),
          swiss: squad.rank.swiss,
          cut: squad.rank.elimination,
          percentile: percentile(
            squad.rank.elimination ?? squad.rank.swiss,
            squads.length
          ).toString(),
        }))
      );
    })
  );

  await setLastSync();

  return {
    name: 'Sync Complete!',
    message: `Synced ${tournaments.length} tournaments including ${squadCount} squads.`,
  };
};
