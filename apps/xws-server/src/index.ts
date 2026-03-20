import { serve } from '@hono/node-server';

import { app } from './app.js';

const port = Number(process.env['PORT'] || 3001);

console.log(`xws-server listening on port ${port}`);

serve({ fetch: app.fetch, port });
