# @pattern-analyzer/xws

Utilities for working with [XWS](https://github.com/elistevens/xws-spec) (X-Wing Squad Specification) data. Provides XWS normalization, YASB URL to XWS conversion, and game data lookups for X-Wing Miniatures.

## Install

```bash
npm install @pattern-analyzer/xws
```

## Features

- Parse and normalize XWS squad data from various tournament platforms
- Convert [YASB](https://yasb.app) URLs directly to XWS objects
- Look up human-readable names for factions, ships, pilots, and upgrades
- Query pilot point costs and skill values
- Generate canonical squad composition fingerprints

## Usage

### YASB URL to XWS

```ts
import { yasb2xws, xwsFromText } from '@pattern-analyzer/xws';

// Convert a YASB URL to XWS
const squad = yasb2xws('https://yasb.app/?f=Rebel%20Alliance&d=...');

// Extract a YASB URL from arbitrary text and convert it
const { xws, url } = xwsFromText('Check out my list: https://yasb.app/?f=...');
```

### XWS Normalization

```ts
import { normalize, toXWS } from '@pattern-analyzer/xws';

// Parse a raw XWS JSON string into a normalized squad object
const squad = toXWS(rawJsonString);

// Normalize an existing XWS squad object
const fixed = normalize(squad);
```

### Game Data Lookups

```ts
import { getFactionName, getPilotName, getShipName } from '@pattern-analyzer/xws';

getFactionName('rebelalliance'); // => 'Rebel Alliance'
getPilotName('lukeskywalker');   // => 'Luke Skywalker'
getShipName('t65xwing');         // => 'T-65 X-wing'
```

## API Reference

### XWS Normalization

| Function | Signature | Description |
|---|---|---|
| `normalize` | `(xws: XWSSquad \| null) => XWSSquad \| null` | Normalizes pilot IDs, upgrade IDs, and point costs in an XWS squad object. |
| `toXWS` | `(raw: string) => XWSSquad \| null` | Parses a raw JSON string into a normalized XWS squad object. Handles non-standard JSON formatting. |
| `parsePilotId` | `(val: string, faction: XWSFaction) => string` | Normalizes a single pilot ID, applying known corrections and suffix expansions. |
| `toFaction` | `(value: string \| null \| undefined) => XWSFaction \| 'unknown'` | Safely casts a string to `XWSFaction`. Returns `'unknown'` if the value is not a recognized faction. |

### YASB Integration

| Function | Signature | Description |
|---|---|---|
| `yasb2xws` | `(val: string \| YASBParams) => XWSSquad` | Converts a YASB URL or parameter object into an XWS squad. |
| `xwsFromText` | `(text: string) => { xws: XWSSquad \| null, url: string \| null }` | Finds a YASB URL in arbitrary text and converts it to XWS. |
| `canonicalize` | `(val: string) => string` | Converts a string to a canonical XWS identifier (lowercase, alphanumeric only). |
| `toPilotId` | `(pilot: YASBPilot) => string` | Derives an XWS pilot ID from a YASB pilot entry. |
| `toUpgradeId` | `(upgrade: YASBUpgrade) => string` | Derives an XWS upgrade ID from a YASB upgrade entry. |
| `getPilotByName` | `(id: string) => YASBPilot \| undefined` | Looks up a YASB pilot entry by XWS ID or display name. |
| `getPointsByName` | `(id: string) => number` | Returns the point cost for a pilot by XWS ID. |
| `getPilotSkill` | `(id: string) => number \| '*'` | Returns the initiative/skill value for a pilot by XWS ID. |

### Game Data Lookups

| Function | Signature | Description |
|---|---|---|
| `getFactionName` | `(faction: XWSFaction) => string` | Returns the display name for a faction. |
| `getShipName` | `(xws: string) => string \| null` | Returns the display name for a ship by XWS ID. |
| `getPilotName` | `(xws: string) => string \| null` | Returns the display name for a pilot by XWS ID. |
| `getUpgradeName` | `(xws: string) => string \| null` | Returns the display name for an upgrade by XWS ID. |
| `getAllFactions` | `() => { id: Factions, name: string }[]` | Returns all factions as `{ id, name }` pairs. |
| `getStandardShips` | `(faction: Factions) => Ships[]` | Returns the list of legal ships for a faction in Standard format. |
| `getFactionByShip` | `(ship: Ships) => XWSFaction` | Returns the faction a ship belongs to. |

### Squad Utilities

| Function | Signature | Description |
|---|---|---|
| `getPilots` | `(xws: XWSSquad) => string[]` | Returns all pilot IDs from a squad. |
| `toCompositionId` | `(xws: XWSSquad) => string` | Generates a canonical composition fingerprint (sorted ship IDs joined by `.`). |
| `getBuilderLink` | `(xws: XWSSquad \| null) => string \| null` | Extracts the squad builder URL from a squad's vendor data. |
| `upgradesToList` | `(upgrades: XWSUpgrades) => string` | Formats all upgrades as a comma-separated string of display names. |
| `isStandardized` | `(pilot: string) => boolean` | Checks if a pilot has a standard loadout. |

### Constants

| Export | Description |
|---|---|
| `YASB_URL_REGEXP` | Regular expression to match YASB URLs. |
| `EXPANSIONS` | Map of expansion abbreviations to their XWS identifiers (e.g. `BoY` => `'battleofyavin'`). |
| `shipIcons` | Map of ship XWS IDs to icon identifiers. |
| `displayValues` | Full lookup table of display names for factions, ships, pilots, and upgrades. |

### Types

| Type | Description |
|---|---|
| `XWSFaction` | Union of all faction XWS IDs. |
| `XWSSquad` | Full squad object with faction, pilots, points, vendor data, and name. |
| `XWSPilot` | Pilot with ID, ship, points, and upgrades. |
| `XWSUpgrades` | Map of upgrade slots to arrays of upgrade IDs. |
| `XWSUpgradeSlots` | Union of all upgrade slot names. |
| `XWSVendor` | Builder metadata (name, URL, link). |
| `Factions` | Union of faction keys from the display values data. |
| `Ships` | Union of ship keys from the display values data. |
| `YASBPilot` | YASB pilot data structure. |
| `YASBUpgrade` | YASB upgrade data structure. |
| `YASBParams` | YASB URL parameter object (`f`, `d`, `sn`, `obs`). |
| `Yasb2XwsConfig` | Configuration for `yasb2xws` upgrade handling. |

## License

MIT
