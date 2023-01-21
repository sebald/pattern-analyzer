import Image from 'next/image';

import { getPilotName, getShipIcon, getUpgradeName } from 'lib/get-value';
import type { XWSSquad, XWSUpgrades } from 'lib/types';

const upgradesToList = (upgrades: XWSUpgrades) =>
  (Object.entries(upgrades) as [keyof XWSUpgrades, string[]][])
    .map(([_, list]) => list.map(name => getUpgradeName(name) || name))
    .flat()
    .join(', ');

export interface SquadProps {
  xws: XWSSquad;
}

export const Squad = ({ xws }: SquadProps) => {
  const { pilots } = xws;

  return (
    <div>
      {pilots.map(({ id, ship, upgrades }, idx) => {
        const icon = getShipIcon(ship);
        console.log(icon);
        return (
          <div key={`${id}-${idx}`} className="pb-4">
            <div className="prose font-semibold text-secondary-900">
              {getPilotName(id) || id}
            </div>
            <div className="prose text-sm text-secondary-500">
              {upgradesToList(upgrades)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
