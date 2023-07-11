'use client';

import { pointsUpdateDate } from '@/lib/config';
import { Select, type SelectProps } from '@/ui';
import {
  fromDate,
  lastWeekend,
  monthsAgo,
  toDate,
} from '@/lib/utils/date.utils';

// Props
// ---------------
export interface DateSelectionProps extends Omit<SelectProps, 'children'> {}

// Component
// ---------------
export const DateSelection = (props: DateSelectionProps) => {
  let options = {
    'Last Points Update': pointsUpdateDate,
    'Last Weekend': toDate.apply(null, lastWeekend()),
    'Last Month': toDate(monthsAgo(1)),
    // Add the option if the last points update is older
    ...(fromDate(pointsUpdateDate) < monthsAgo(3)
      ? { 'Last 3 Months': toDate(monthsAgo(3)) }
      : {}),
  };
  type Options = keyof typeof options;

  // Add "custom" option if defaultValue isn't an existing option
  if (!Object.values(options).find(option => option === props.defaultValue)) {
    // @ts-expect-error
    options['Custom'] = props.defaultValue;
  }

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
