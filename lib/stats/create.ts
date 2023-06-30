import { SquadData } from '@/lib/types';
import { collect } from './collect';
import { init } from './init';

export const create = (list: SquadData[][]) => {
  const result = init();
  const all = list.map(collect);
};
