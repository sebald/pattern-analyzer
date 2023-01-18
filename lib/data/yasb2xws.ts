import { XWSFaction, XWSPilot, XWSSquad, XWSUpgrades } from 'lib/xws';
import yasb from './yasb.json';

/**
 * Adopted from YASB source. This transforms a
 * displayed value that can be used in XWS.
 */
export const normalize = (val: string) =>
  val
    .toLowerCase()
    /**
     * YASB added the ship, faction, ... to the name
     * property of pilots and upgrades. We need to remove this
     * in order to get the correct XWS id.
     */
    .replace(/\s\(.+$/, '')
    .replace(/[^a-z0-9]/g, '')
    .replace(/\s+/g, '-');

export const yasb2xws = (link: string): XWSSquad => {
  const url = new URL(link);

  const params = Object.fromEntries(url.searchParams.entries()) as Record<
    'f' | 'd' | 'sn' | 'obs',
    string
  >;

  const faction = params.f.replace(/\s/g, '').toLowerCase() as XWSFaction;

  /**
   * YSB data param: <version>Z<format type>Z<squad points>Z<squad>
   *
   * Squad data uses "Y"s to separate ships and inside this part
   * "X"s are used to separate pilots from the upgrades. Upgrade slots
   * are separated with "W"s. This means there are potentially
   * "Ws" after one another, if the slot is empty.
   *
   * For example:
   * <number>X<number>W<number>W<number>Y<number>X<number>WWW<number>
   */
  const squad = params.d.substring(params.d.lastIndexOf('Z') + 1);

  const pilots: XWSPilot[] = [];

  squad.split('Y').forEach(ship => {
    if (ship.length === 0) {
      return;
    }

    /**
     * Split ship string by pilot (X) and upgrades (W), since we don't
     * care about empty slots, remove empty ones.
     */
    const [pilotId, ...upgradeIds] = ship.split(/[XW]/).filter(Boolean);

    const pilot = yasb.pilots[Number(pilotId)];

    if (!pilot) {
      return;
    }

    const upgrades = upgradeIds.reduce((o, uid) => {
      const upgrade = yasb.upgrades[Number(uid)];

      // Skip unknown upgrades.
      if (!upgrade) {
        return o;
      }

      const slot =
        upgrade.slot === 'Force'
          ? 'force-power'
          : (normalize(upgrade.slot || 'unknown-slot') as keyof XWSUpgrades);
      const name = upgrade.xws || normalize(upgrade.name || 'unknown-upgrade');

      if (!o[slot]) {
        o[slot] = [];
      }
      //@ts-expect-error
      o[slot].push(name);

      return o;
    }, {} as XWSUpgrades);

    pilots.push({
      id: pilot.xws || normalize(pilot.name || 'unknown-pilot'),
      ship: normalize(pilot.ship || 'unknown-ship'),
      points: pilot.points || 0,
      upgrades,
    });
  });

  return {
    faction,
    pilots,
    name: params.sn,
    points: 20,
    version: '2.5',
    vendor: {
      builder: 'YASB - X-Wing 2.5',
      builder_url: 'https://yasb.app/',
      url: link,
    },
  };
};
