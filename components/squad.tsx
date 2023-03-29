import { getPilotName, getShipName, getUpgradeName } from '@/lib/get-value';
import type { XWSSquad, XWSUpgrades } from '@/lib/types';

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
    <div className="flex flex-col gap-4">
      {pilots.map(({ id, ship, upgrades }, idx) => (
        <div key={`${id}-${idx}`}>
          <div
            className="flex items-center pb-1 font-semibold text-secondary-900"
            title={`Ship: ${getShipName(ship) || ship}`}
          >
            {getPilotName(id) || id}
          </div>
          {upgrades && (
            <div className="prose text-sm text-secondary-500">
              {upgradesToList(upgrades)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
