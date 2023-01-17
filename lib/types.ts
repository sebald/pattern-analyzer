import { XWSSquad } from './xws';

export interface SquadData {
  id: string | undefined;
  url: string;
  xws: XWSSquad;
  raw: string;
  player: string;
}
