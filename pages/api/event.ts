import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import * as longshanks from 'lib/longshanks';
import * as rollbetter from 'lib/rollbetter';
import type { EventData } from 'lib/types';
import { shortenTitles } from 'lib/utils';

const VENDOR_MAP = {
  longshanks,
  rollbetter,
};

const schema = z.object({
  vendor: z.union([z.literal('longshanks'), z.literal('rollbetter')]),
  id: z.union([
    z.string().regex(/^[0-9]+$/),
    z.array(z.string().regex(/^[0-9]+$/)),
  ]),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST' || req.method === 'DELETE') {
    return res.status(405).send('Unssported HTTP method.');
  }

  const result = schema.safeParse(req.query);

  if (!result.success) {
    return res
      .status(400)
      .json({ name: 'Error parsing input.', message: result.error.issues });
  }

  const { id, vendor } = result.data;
  const ids = Array.isArray(id) ? id : [id];
  const getEvent = VENDOR_MAP[vendor].getEvent;

  try {
    const events = await Promise.all(ids.map(getEvent));

    // Merge events into one
    const data = events.reduce<EventData>(
      (o, { title, id, url, squads }) => {
        o.title = shortenTitles(o.title, title || '');
        o.urls.push({ href: url, text: `Event #${id}` });
        o.squads.push(...squads);

        return o;
      },
      {
        title: '',
        urls: [],
        squads: [],
      }
    );

    return res.status(200).json(data);
  } catch (e) {
    const { name, message } = e as Error;
    return res.status(500).json({ name, message });
  }
};

export default handler;
