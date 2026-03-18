import { Select } from './select';

// Props
// ---------------
export type SortOptions =
  | 'percentile'
  | 'deviation'
  | 'winrate'
  | 'frequency'
  | 'count'
  | 'score';

export interface SortSelectionProps {
  value: SortOptions;
  onChange: (sortBy: SortOptions) => void;
}

// Component
// ---------------
export const SortSelection = ({ value, onChange }: SortSelectionProps) => (
  <Select
    size="small"
    aria-label="Select a value to sort by"
    value={value}
    onChange={e => onChange(e.target.value as any)}
  >
    <Select.Option value="percentile">By Percentile</Select.Option>
    <Select.Option value="deviation">By Std. Deviation</Select.Option>
    <Select.Option value="winrate">By Winrate</Select.Option>
    <Select.Option value="frequency">By Frequency</Select.Option>
    <Select.Option value="count">By Count</Select.Option>
    <Select.Option value="score">By Score</Select.Option>
  </Select>
);
