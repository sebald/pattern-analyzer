import { XWSFaction, XWSPilot, XWSSquad } from 'lib/xws';
import yasb from './yasb.json';

/**
 * Stolen from YASB source. This transforms a
 * displayed value that can be used in XWS.
 */
export const normalize = (val = 'unkown') =>
  val
    .toLowerCase()
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

      return o;
    }, {});

    // TODO: Keep display name? (as name)
    pilots.push({
      id: pilot.xws || normalize(pilot.name),
      // name: pilot.name || 'Unkown Pilot',
      ship: normalize(ship),
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
