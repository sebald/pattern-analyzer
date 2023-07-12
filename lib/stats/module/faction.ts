import type { XWSFaction } from '@/lib/types';
import type { StatModule } from '../factory';
import type { CommonDataCollection } from '../types';
import { initCommonData } from '../init';

export interface FactionStats {
  faction: {
    [Faction in XWSFaction | 'unknown']: CommonDataCollection;
  };
}

export const faction: () => StatModule<FactionStats> = () => {
  const data = {
    rebelalliance: initCommonData(),
    galacticempire: initCommonData(),
    scumandvillainy: initCommonData(),
    resistance: initCommonData(),
    firstorder: initCommonData(),
    galacticrepublic: initCommonData(),
    separatistalliance: initCommonData(),
    unknown: initCommonData(),
  } satisfies FactionStats['faction'];

  return {
    squad: (squad, { faction }) => {
      const rank = squad.rank;
      data[faction].count += 1;
      data[faction].ranks.push(rank.elimination ?? rank.swiss);
      data[faction].records.push(squad.record);
    },
    get: () => ({
      faction: data,
    }),
  };
};
