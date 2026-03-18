import useSWR from 'swr/immutable';

import { toListfortress } from './export';
import { ListfortressExport, ListfortressRound } from './types';
import { useLongshanksSquads } from './useLongshanksSquads';
import { getJson } from './utils';

export const useLongshanksExport = ({ id }: { id: string }) => {
  const { squads, isLoading: loadingSquads } = useLongshanksSquads({ id });
  const { data: rounds, isLoading: loadingRounds } = useSWR<
    ListfortressRound[]
  >(`/api/longshanks/${id}/rounds`, getJson);

  let data: ListfortressExport | undefined;
  if (squads && rounds) {
    data = toListfortress({ squads, rounds });
  }

  return { data, isLoading: loadingSquads || loadingRounds };
};
