import { SquadData, XWSSquad } from './types';
import { normalize } from './xws';
import { yasb2xws } from './yasb2xws';

export interface RollBetterTournamentResponse {
  id: number;
  title: string;
  startDate: string;
  endDate: string | null;
  timezone: string;
  description: string;
  registrationCount: number;
  // there is more but this is all we need for now
}
export interface RollBetterListResponse {
  registrations: Registration[];
  count: number;
}

export interface Registration {
  id: number;
  withList?: string;
  withAlternateList: any;
  isWaitlisted: boolean;
  player: {
    username: string;
  };
  listSummary?: {
    id: number;
    faction: string;
    units: string[];
  };
}

const getLists = async (id: string, count: number) => {
  // rollbetter's max page count seems to be 25
  const pageSize = 25;
  const pagination = [];

  let current = 0;
  while (current < count) {
    pagination.push(current);
    current = current + pageSize;
  }

  const responses = await Promise.all(
    pagination.map(skip =>
      fetch(
        `https://rollbetter-linux.azurewebsites.net/tournaments/${id}/lists?skip=${skip}&take=25`
      )
    )
  );

  let data: RollBetterListResponse[] = [];

  data = await Promise.all<RollBetterListResponse>(
    responses.map(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch event data...');
      }

      return res.json();
    })
  ).catch(() => {
    /**
     * This handles a werid rollbetter API where hidden lists returns an empty 200.
     */
    return [];
  });

  return data.map(({ registrations }) => registrations).flat();
};

export const getSquads = async (id: string, count: number) => {
  const data = await getLists(id, count);
  const squads: SquadData[] = [];

  data.forEach(({ id, withList, player }) => {
    let xws: XWSSquad | null = null;
    let url: string | null = null;

    try {
      if (withList) {
        // Check if given as JSON
        if (withList.startsWith('{')) {
          xws = normalize(JSON.parse(withList));
        }
        // Check if given as YASB Url
        if (withList.trim().startsWith('https://yasb.app')) {
          xws = yasb2xws(withList);
        }

        url =
          xws?.vendor?.yasb?.link ||
          xws?.vendor?.lbn?.link.replace('print', '') ||
          null;
      }
    } catch {
      console.log(
        `Failed to parse squad of "${player.username}" (${id}).\nOriginal value is: :${withList}`
      );
    }

    squads.push({
      id: `${id}`,
      url,
      xws,
      raw: withList || '',
      player: player.username,
    });
  });

  return squads;
};

export const getEventInfo = async (id: string) => {
  const api_url = `https://rollbetter-linux.azurewebsites.net/tournaments/${id}`;
  const res = await fetch(api_url);

  if (!res.ok) {
    throw new Error('Failed to fetch event data...');
  }

  const {
    title,
    description,
    startDate,
    endDate,
    registrationCount,
  }: RollBetterTournamentResponse = await res.json();

  const date = startDate + (endDate ? ` ${endDate}` : '');

  return {
    url: `https://rollbetter.gg/tournaments/${id}`,
    id,
    vendor: 'rollbetter',
    title,
    date,
    description,
    players: registrationCount,
  };
};

export const getEvent = async (id: string) => {
  const { url, title, players } = await getEventInfo(id);
  const squads = await getSquads(id, players);

  return { url, title, squads };
};
