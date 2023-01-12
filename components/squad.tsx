import { XWSSquad } from 'lib/xws';

export interface SquadProps {
  xws: XWSSquad;
}

export const Squad = ({ xws }: SquadProps) => {
  const { pilots } = xws;

  return <div>{pilots.map(pilot => pilot.id).join(', ')}</div>;
};
