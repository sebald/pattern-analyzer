import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const schema = z.object({
  id: z.string().regex(/^[0-9]+$/),
});

/**
 * Proxy for rollbetter since it does not like CORS.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method && /POST|PUT|DELETE/.test(req.method)) {
    return res.status(405).json({
      name: 'Method not allowed',
      message: `Unsupported HTTP method "${req.method}".`,
    });
  }

  const result = schema.safeParse(req.query);

  if (!result.success) {
    return res
      .status(400)
      .json({ name: 'Error parsing input.', message: result.error.issues });
  }

  const { id } = result.data;
  const rollbetter = await fetch(
    `https://rollbetter-linux.azurewebsites.net/tournaments/${id}/list-fortress-json`
  );

  if (!rollbetter.ok) {
    return res.status(500).json({
      name: 'Proxy Error',
      message: `Got a ${rollbetter.status} from rollbetter.`,
    });
  }

  const json = await rollbetter.json();
  return res.status(200).json(json);
};

export default handler;
