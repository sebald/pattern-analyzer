import type { StatsRange } from '@/lib/stats/range';
import { formatDate, today } from '@/lib/utils/date.utils';

import { Message } from '@/ui/message';

// Props
// ---------------
export interface EmptyRangeProps {
  /**
   * What was not flown, e.g. "composition" or "pilot".
   */
  subject: string;
  range: Pick<StatsRange, 'from' | 'to'>;
}

// Component
// ---------------
export const EmptyRange = ({ subject, range }: EmptyRangeProps) => (
  <div className="grid flex-1 place-items-center">
    <Message>
      <Message.Title>No squads in the current date range</Message.Title>
      Nobody flew this {subject} between {formatDate(range.from)} and{' '}
      {formatDate(range.to || today())}.
    </Message>
  </div>
);
