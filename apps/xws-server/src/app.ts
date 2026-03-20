import { zValidator } from '@hono/zod-validator';
import { Hono, type Context, type Next } from 'hono';
import { cors } from 'hono/cors';
import { z } from 'zod';

import { yasb2xws } from '@pattern-analyzer/xws/yasb';

// Rate limiter
// ---------------
export const rateLimitMap = new Map<
  string,
  { count: number; resetTime: number }
>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 60; // requests per window

const rateLimiter = async (c: Context, next: Next) => {
  const ip =
    c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ??
    c.req.header('x-real-ip') ??
    'unknown';
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
  } else {
    entry.count++;
    if (entry.count > RATE_LIMIT_MAX) {
      return c.json({ error: 'Too many requests' }, 429);
    }
  }

  // Periodically clean up stale entries
  if (rateLimitMap.size > 10_000) {
    for (const [key, val] of rateLimitMap) {
      if (now > val.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }

  await next();
};

// Schema
// ---------------
const querySchema = z.object({
  f: z.string(),
  d: z.string(),
  sn: z.string(),
  obs: z.string().optional(),
});

// App
// ---------------
export const app = new Hono();

app.use('*', cors());
app.use('*', rateLimiter);

app.get(
  '/api/yasb/xws',
  zValidator('query', querySchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          name: 'Error parsing input.',
          message: result.error.issues,
        },
        400
      );
    }
  }),
  (c) => {
    const params = c.req.valid('query');

    try {
      const xws = yasb2xws(params);
      return c.json(xws);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown conversion error';
      return c.json({ error: 'Conversion failed', message }, 400);
    }
  }
);

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }));
