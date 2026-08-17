---
'pattern-analyzer.app': patch
---

Fix stats pages being empty and composition/pilot detail pages returning a 404
right after a points update.

The window all stats are calculated for is now resolved in one place
(`lib/stats/range.ts`). It defaults to the last points update and automatically
widens to the last six months while that window does not hold enough data yet,
which the date range caption now points out. Detail pages use the same window
instead of hardcoding the points update date.

Aggregating an empty set of squads no longer throws (which was reported as a
404) but renders an empty state, and frequencies show 0% instead of NaN when
there is nothing to divide by.
