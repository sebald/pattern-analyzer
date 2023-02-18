import ffgXws from 'lbn-core/dist/assets/ffg-xws';
import { slotKeys } from 'lbn-core/dist/helpers/enums';
import { SlotKey } from 'lbn-core/dist/types';
import { XWSPilot, XWSSquad } from './types';

export const LBN_URL_REGEXP =
  /https:\/\/launchbaynext\.app\/\?lbx(?:[-a-zA-Z0-9()@:%_*'\\\+.~#?&\/=,]*)/;

const deserialize = (link: string) => {
  const rep = (c: string, t: string, d: string | number) => {
    if (typeof d === 'number') {
      return `${d}`;
    }

    while (d.indexOf(c) >= 0) {
      d = d.replace(c, t);
    }
    return d;
  };

  let o = link;
  o = rep('%27%27', '%27%20%27', o);
  o = rep("''", "' '", o);
  o = o
    .split('.')
    .map((s, i) => {
      if (i > 2) {
        return rep('l', '(', rep('r', ')', s));
      }
      return s;
    })
    .join('.');
  o = rep('.', ',', o);

  o = rep('(', '[', o);
  o = rep(')', ']', o);
  o = rep("'", '"', o);
  o = rep('""', '"', o);

  if (o[0] !== '[') {
    o = `[${o}]`;
  }

  try {
    const d = JSON.parse(o);
    const [squadName, cost, faction, pilotIds, obstacles, ...rest] = d;

    // TODO
    //const faction = ffgXws.factions[faction];

    const getPilots = () => {
      if (Array.isArray(pilotIds[0]) || pilotIds.length === 0) {
        return pilotIds;
      } else {
        return [pilotIds, obstacles, ...rest];
      }
    };

    const pilots = getPilots().map((p: any): XWSPilot => {
      console.log(p);
      const [dShip, dId, ...upgrades] = p;
      const ship = rep(']', 'r', rep('[', 'l', dShip));
      const id = rep(']', 'r', rep('[', 'l', dId));

      const parsedUpgrades: { [key in SlotKey]?: string[] } = {};
      (upgrades || []).forEach((u: any) => {
        const [key, ...list] = u;
        parsedUpgrades[ffgXws.slots[key]] = list.map((l: string) => {
          const xws = rep(']', 'r', rep('[', 'l', l));
          return ffgXws.upgrades[xws] || xws;
        });
      });

      const pp = {
        id: ffgXws.pilots[`${id}`] || id,
        ship: ffgXws.ships[`${ship}`] || ship,
        points: 0,
        upgrades: parsedUpgrades,
      };
      console.log(pp);

      // const s = loadShip2(pp, fa, fo);
      return {
        // ...pp,
        points: s.pilot?.cost || 0,
      };
    });

    const xws: XWSSquad = {
      name: decodeURIComponent(squadName),
      points: parseInt(cost, 10),
      faction,
      pilots,
      version: '2.5.0',
      vendor: {
        lbn: {
          builder: 'Launch Bay Next',
          builder_url: 'https://launchbaynext.app',
          link,
          // Using date when we updated parser the last time
          version: '2023-02-18',
        },
      },
    };
    return xws;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const lbn2xws = (link: string) => {
  // Handle broken links
  try {
    const url = new URL(link);
    const params = Object.fromEntries(url.searchParams.entries()) as Record<
      'lbx',
      string
    >;

    return deserialize(params.lbx.replace(/\\'/g, "'"));
  } catch {
    return null;
  }
};
