import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import * as longshanks from 'lib/longshanks';
import * as rollbetter from 'lib/rollbetter';

const VENDOR_MAP = {
  longshanks,
  rollbetter,
};

const schema = z.object({
  vendor: z.union([z.literal('longshanks'), z.literal('rollbetter')]),
  ids: z.array(z.string()),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST' || req.method === 'DELETE') {
    return res.status(405).send('Unssported HTTP method.');
  }

  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res
      .status(400)
      .json({ name: 'Error parsing input.', message: result.error.issues });
  }

  const { ids, vendor } = result.data;
  const getEvent = VENDOR_MAP[vendor].getEvent;

  try {
    const data = await Promise.all(ids.map(getEvent));
    return res.status(200).json(data);
  } catch (e) {
    const { name, message } = e as Error;
    return res.status(500).json({ name, message });
  }
};

export default handler;
