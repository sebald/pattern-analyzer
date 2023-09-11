#!/usr/bin/env tsx
import 'zx/globals';

import dotenv from 'dotenv';
import { connect, type Config } from '@planetscale/database';

// Config
// ---------------
$.verbose = false;

dotenv.config({ path: '.env.local' });

const config = {
  url: process.env.DATABASE_URL,
} satisfies Config;

// Queries
// ---------------
const query = `
SELECT
    t1.*,
    t2.faction,
    t2.faction_count
FROM
    (SELECT * FROM squads WHERE date BETWEEN '2023-07-01' AND '2023-08-03') AS t1
LEFT JOIN
    (
        SELECT faction, COUNT(*) AS faction_count
        FROM squads
        WHERE date BETWEEN '2023-07-01' AND '2023-08-03'
        GROUP BY faction
    ) AS t2
ON t1.faction = t2.faction;
`;

// Script
// ---------------
void (async () => {
  const db = await connect(config);
  const result = await db.execute(query);

  console.log(result);
})();
