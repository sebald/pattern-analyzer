import { xwingShips } from 'app/fonts';
import map from 'lib/data/ship-icons.json';

export interface ShipIconProps {
  ship: string;
}

export const ShipIcon = ({ ship }: ShipIconProps) => {
  return (
    <div className={`${xwingShips.className} inline-block`}>
      {map[ship] || ship}
    </div>
  );
};
