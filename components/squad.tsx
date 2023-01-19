import { getPilot, getUpgrade } from 'lib/get-data';
import type { XWSSquad, XWSUpgrades } from 'lib/types';

const upgradesToList = (upgrades: XWSUpgrades) =>
  (Object.entries(upgrades) as [keyof XWSUpgrades, string[]][])
    .map(([type, list]) =>
      list.map(name => {
        const u = getUpgrade({ type, name });
        return u ? u.name : name;
      })
    )
    .flat()
    .join(', ');

export interface SquadProps {
  xws: XWSSquad;
}

export const Squad = ({ xws }: SquadProps) => {
  const { faction, pilots } = xws;

  return (
    <div>
      {pilots.map(({ id, ship, upgrades }, idx) => {
        const pilot = getPilot({ faction, ship, pilot: id });

        return (
          <div key={`${id}-${idx}`} className="pb-4">
            <div className="prose font-semibold text-secondary-900">
              {pilot ? pilot.name : id}
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
