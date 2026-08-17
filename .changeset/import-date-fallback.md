---
'pattern-analyzer.app': patch
---

Import the last six months of tournaments during `db:setup` when the last points update is less than six months ago. Right after a points update there is barely any tournament data, which previously left the database empty.

Also guard `addTournaments` and `addSquads` against empty arrays. An insert without rows is invalid SQL, which made both `db:setup` and the scheduled sync fail whenever there was nothing new to add.
