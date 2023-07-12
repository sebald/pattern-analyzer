import type { XWSFaction } from '@/lib/types';
import type { StatModule } from '../factory';
import type { CommonDataCollection } from '../types';
import { initCommonData } from '../init';

export interface FactionData {
  faction: {
    [Faction in XWSFaction | 'unknown']: CommonDataCollection;
  };
}

export const faction: () => StatModule<FactionData> = () => {
  const data: FactionData['faction'] = {
    rebelalliance: initCommonData(),
    galacticempire: initCommonData(),
    scumandvillainy: initCommonData(),
    resistance: initCommonData(),
    firstorder: initCommonData(),
    galacticrepublic: initCommonData(),
    separatistalliance: initCommonData(),
    unknown: initCommonData(),
  };

  return {
    squad: (squad, { faction: fid }) => {
      const rank = squad.rank;
      data[fid].count += 1;
      data[fid].ranks.push(rank.elimination ?? rank.swiss);
      data[fid].records.push(squad.record);

      // TODO: add total to ctx and calculate percentile (store in module)
    },
    get: ({ total }) => {
      return {
        // TODO: Move calculations from create here
        faction: data,
      };
    },
  };
};
