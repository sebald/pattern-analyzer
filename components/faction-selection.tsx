import { getAllFactions } from '@/lib/get-value';
import { XWSFaction } from '@/lib/types';
import { Select } from './select';

export type FactionSelectionProps =
  | {
      value: XWSFaction;
      onChange: (faction: XWSFaction) => void;
      allowAll?: never | false;
    }
  | {
      value: 'all' | XWSFaction;
      onChange: (faction: 'all' | XWSFaction) => void;
      allowAll: true;
    };

export const FactionSelection = ({
  value,
  onChange,
  allowAll,
}: FactionSelectionProps) => (
  <Select
    size="small"
    aria-label="Select a faction"
    value={value}
    onChange={e => onChange(e.target.value as any)}
  >
    {allowAll && <Select.Option value="all">All Factions</Select.Option>}
    {getAllFactions().map(({ id, name }) => (
      <Select.Option key={id} value={id}>
        {name}
      </Select.Option>
    ))}
  </Select>
);
