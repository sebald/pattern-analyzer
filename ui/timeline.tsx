import { ReactNode } from 'react';

// Timeline.Item
// ---------------
export interface TimelineItemProps {
  children?: ReactNode;
}

const TimelineItem = ({ children }: TimelineItemProps) => <div>{children}</div>;

// Timeline.Header
// ---------------
export interface TimelineHeaderProps {
  children?: ReactNode;
}

const TimelineHeader = ({ children }: TimelineHeaderProps) => (
  <div>{children}</div>
);

// Timeline.Body
// ---------------
export interface TimelineBodyProps {
  children?: ReactNode;
}

const TimelineBody = ({ children }: TimelineBodyProps) => <div>{children}</div>;

// Props
// ---------------
export interface TimelineProps {
  children?: ReactNode;
}

// Component
// ---------------
export const Timeline = ({ children }: TimelineProps) => {
  return <div className="">{children}</div>;
};

Timeline.Item = TimelineItem;
Timeline.Header = TimelineHeader;
Timeline.Body = TimelineBody;
