import { getAllFactions } from 'lib/get-value';
import type { FactionOptions } from 'lib/types';

import { Select } from './select';

export interface FactionSelectProps {
  value: FactionOptions;
  onChange: (faction: FactionOptions) => void;
}

export const FactionSelect = ({ value, onChange }: FactionSelectProps) => (
  <Select
    size="small"
    aria-label="Faction"
    value={value}
    onChange={e => onChange(e.target.value as FactionOptions)}
  >
    <Select.Option value="all">All Factions</Select.Option>
    {getAllFactions().map(({ id, name }) => (
      <Select.Option key={id} value={id}>
        {name}
      </Select.Option>
    ))}
  </Select>
);
