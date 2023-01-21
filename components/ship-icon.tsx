import { xwingShips } from 'app/fonts';
import map from 'lib/data/ships-map.json';

export interface ShipIconProps {
  ship: string;
}

export const ShipIcon = ({ ship }: ShipIconProps) => {
  let children = (map.ships as any)[ship];

  if (children === 'delta7baethersprite') {
    children = 'delta7aethersprite';
  }

  if (!children) {
    return null;
  }

  return (
    <div className={`${xwingShips.className} inline-block`}>{children}</div>
  );
};
