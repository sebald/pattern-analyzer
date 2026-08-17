'use client';

import { pointsUpdateDate } from '@/lib/config';
import { Select, type SelectProps } from '@/ui/select';
import { dateRangePresets } from '@/lib/utils/params.utils';

// Props
// ---------------
export interface DateSelectionProps extends Omit<SelectProps, 'children'> {}

// Component
// ---------------
export const DateSelection = (props: DateSelectionProps) => {
  const presets = dateRangePresets(pointsUpdateDate);
  const defaultValue = String(props.defaultValue ?? '');

  // Add "custom" option if defaultValue isn't an existing option
  const options = Object.values(presets).includes(defaultValue)
    ? presets
    : { ...presets, Custom: defaultValue };
  type Options = keyof typeof options;

  return (
    <Select {...props} size="small">
      {Object.keys(options).map(label => (
        <Select.Option key={label} value={options[label as Options]}>
          {label}
        </Select.Option>
      ))}
    </Select>
  );
};
