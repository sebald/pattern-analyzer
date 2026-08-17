---
'pattern-analyzer.app': patch
---

Declare the database environment variables in `turbo.json` so they reach `next build`. Turborepo's strict env mode was filtering them out, which made the Vercel build fall back to `127.0.0.1:3306` and fail with `ECONNREFUSED` while collecting page data.
