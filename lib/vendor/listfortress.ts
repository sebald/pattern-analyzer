// Types
// ---------------
export interface ListfortressTournament {
  id: number;
  name: string;
  location: string;
  state: string;
  country: string;
  date: string;
  format_id: number;
  version_id: any;
  tournament_type_id: number;
  created_at: string;
  updated_at: string;
  participants: ListfortressParticipant[];
  rounds: ListfortressRound[];
}

export interface ListfortressParticipant {
  id: number;
  name: string;
  tournament_id: number;
  score: number;
  swiss_rank: number;
  top_cut_rank?: number;
  mov: number;
  sos: string;
  dropped: any;
  list_points: any;
  list_json?: string;
  event_points: any;
  mission_points: any;
}

export interface ListfortressRound {
  id: number;
  tournament_id: number;
  roundtype_id: number;
  round_number: number;
  scenario: string;
  matches: ListfortressMatch[];
}

export interface ListfortressMatch {
  id: number;
  player1_id: number;
  player1_points: number;
  player2_id?: number;
  player2_points: number;
  result: any;
  winner_id?: number;
  rounds_played: any;
  went_to_time: any;
}

// Fetch
// ---------------
const getTournament = async (id: string) => {
  const api_url = `https://listfortress.com/api/v1/tournaments/${id}`;
  const res = await fetch(api_url);

  if (!res.ok) {
    throw new Error(`[listfortress] Failed to fetch event data... (${id})`);
  }

  const tournament: ListfortressTournament = await res.json();
  return tournament;
};

// API
// ---------------
export const getEventInfo = async (id: string) => {
  const { name, date } = await getTournament(id);

  return {
    name,
    date,
    url: `https://listfortress.com/tournaments/${id}`,
    vendor: 'listfortress',
  };
};
