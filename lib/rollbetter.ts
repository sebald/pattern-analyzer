import { SquadsData, XWSSquad } from './types';

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

  const data = await Promise.all<RollBetterListResponse>(
    responses.map(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch event data...');
      }

      return res.json();
    })
  );

  return data.map(({ registrations }) => registrations).flat();
};

export const getSquads = async (id: string, count: number) => {
  const data = await getLists(id, count);
  const squads: SquadsData[] = [];

  data.forEach(({ id, withList, player }) => {
    let xws: XWSSquad | null = null;
    let url: string | null = null;

    try {
      if (withList) {
        xws = JSON.parse(withList);
        url = xws?.vendor?.yasb?.link || xws?.vendor?.lbn?.link || null;
      }
    } catch {
      console.log(id, player.username, withList);
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

export const getEventTitle = async (id: string) => {
  const url = `https://rollbetter-linux.azurewebsites.net/tournaments/${id}`;
  const res = await fetch(url);

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

  const date = startDate + endDate ? ` ${endDate}` : '';

  return {
    url,
    id,
    title,
    date,
    description,
    players: registrationCount,
  };
};

export const getEvent = async (id: string) => {
  const { url, title, players } = await getEventTitle(id);
  const squads = await getSquads(id, players);

  return { url, title, squads };
};
