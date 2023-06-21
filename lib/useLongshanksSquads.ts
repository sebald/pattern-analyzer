import useSWR from 'swr/immutable';
import { PlayerData, SquadData, XWSData } from '@/lib/types';
import { getJson } from '@/lib/utils/fetch.utils';

export const useLongshanksSquads = ({ id }: { id: string }) => {
  const { data: players, error: playerError } = useSWR<PlayerData[]>(
    `/api/longshanks/${id}/players`,
    getJson
  );

  const { data: squads, error: xwsError } = useSWR(
    () => (players ? players.map(player => player.id) : null),
    async playerIds => {
      const result: XWSData[] = await Promise.all(
        playerIds.map(pid => getJson(`/api/longshanks/${id}/xws/${pid}`))
      );

      return players?.map(player => {
        const xws = result.find(({ id }) => player.id === id) || {
          id: player.id,
          url: null,
          xws: null,
          raw: '',
        };

        return {
          ...player,
          ...xws,
        } satisfies SquadData;
      });
    }
  );

  return { squads, error: playerError || xwsError };
};
