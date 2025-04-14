import yasb from './data/yasb.json';
import { getPilotName, type Ships } from './get-value';
import type { XWSSquad, XWSFaction, XWSPilot, XWSUpgrades } from './types';

export interface YASBPilot {
  id: number;
  name: string;
  ship: string;
  points: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  skill: 0 | 1 | 2 | 3 | 4 | 5 | 6 | '*';
  xws?: string;
  xwsaddon?: string;
}

export interface YASBUpgrade {
  id: number;
  name: string;
  slot?: string;
  xws?: string;
  xwsaddon?: undefined;
}

export const YASB_URL_REGEXP =
  /https:\/\/yasb\.app\/\?f(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=,]*)/;

export const EXPANSIONS = {
  BoY: 'battleofyavin',
  SoC: 'siegeofcoruscant',
  TBE: 'swz98',
  YLF: 'swz103',
  BoE: 'battleoverendor',
  EoD: 'evacuationofdqar',
  AaD: 'armedanddangerous',
};

export const canonicalize = (val: string) =>
  val
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/\s+/g, '-');

export const toPilotId = (pilot: YASBPilot) => {
  const [name, suffix] = pilot.name.split(/[()]/);

  return pilot.xws != null
    ? pilot.xws
    : pilot.xwsaddon != null
      ? canonicalize(name) + '-' + pilot.xwsaddon
      : canonicalize(name) +
        (suffix != null ? '-' + canonicalize(pilot.ship) : '');
};

export const toUpgradeId = (upgrade: YASBUpgrade) => {
  const [name, suffix] = upgrade.name.split(/[()]/);

  return upgrade.xws != null
    ? upgrade.xws
    : upgrade.xwsaddon != null
      ? canonicalize(name) + '-' + upgrade.xwsaddon
      : canonicalize(name) +
        (suffix != null
          ? '-' +
            canonicalize((EXPANSIONS as any)[suffix] || upgrade.slot || '')
          : '');
};

/**
 * Search by id first, but some pilots don't have a xws property in the
 * YASB data, so we need to search by name too.
 */
export const getPilotByName = (id: string) => {
  const pilot = yasb.pilots.find(pilot => pilot.xws === id) as
    | YASBPilot
    | undefined;

  if (pilot) {
    return pilot;
  }

  // Normalize names that contain weird quotes and use regular instead
  const name = getPilotName(id)?.replace(/[“”]/g, '"');
  return yasb.pilots.find(pilot => pilot.name === name) as
    | YASBPilot
    | undefined;
};

export const getPointsByName = (id: string) => {
  const { points } = getPilotByName(id) || {
    points: 1,
  };
  return points || 1;
};

export const getPilotSkill = (id: string) => {
  const { skill } = getPilotByName(id) || { skill: 1 };
  return skill;
};

export interface YASBParams {
  d: string;
  sn: string;
  f: string;
  obs?: string | undefined;
}

export interface Yasb2XwsConfig {
  upgrades: 'ALL' | 'IGNORE_STANDARDIZED';
}

const parseYASBUrl = (val: string) => {
  const url = new URL(val);
  return Object.fromEntries(url.searchParams.entries()) as Record<
    'f' | 'd' | 'sn' | 'obs',
    string
  >;
};

/**
 * Converts as YASB URL to XWS
 */
export const yasb2xws = (val: string | YASBParams): XWSSquad => {
  const params = typeof val === 'string' ? parseYASBUrl(val) : val;
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
          : (canonicalize(upgrade.slot || 'unknown-slot') as keyof XWSUpgrades);
      const name = toUpgradeId(upgrade as YASBUpgrade);

      if (!o[slot]) {
        o[slot] = [];
      }

      o[slot].push(name);

      return o;
    }, {} as XWSUpgrades);

    pilots.push({
      id: toPilotId(pilot as YASBPilot),
      ship: canonicalize(pilot.ship || 'unknown-ship') as Ships,
      points: pilot.points || 1, // This actually never happens ... hopefully
      upgrades,
    });
  });

  const link = new URL('https://yasb.app');
  Object.entries(params).forEach(([name, value]) => {
    link.searchParams.set(name, value);
  });

  return {
    faction,
    pilots,
    name: params.sn,
    points: 20,
    version: '2.5',
    vendor: {
      yasb: {
        builder: 'YASB - X-Wing 2.5',
        builder_url: 'https://yasb.app/',
        version: '',
        link: link.toString(),
      },
    },
    obstacles: params.obs ? params.obs.split(',') : undefined,
  };
};

/**
 * Tries to find a YASB URL in a text and converts it to XWS.
 */
export const xwsFromText = (text: string) => {
  // Remove new lines, makes it easier to regex on it
  const val = text.replace(/(\r\n|\n|\r)/gm, '');
  const url = (val.match(YASB_URL_REGEXP) || [null])[0];

  return {
    xws: url ? yasb2xws(url) : null,
    url,
  };
};
