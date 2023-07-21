import { ReactNode } from 'react';

// Timeline.Item
// ---------------
export interface TimelineItemProps {
  children?: ReactNode;
}

const TimelineItem = ({ children }: TimelineItemProps) => (
  <div className="flex flex-col gap-4">
    <div className="absolute left-[-9px] mt-1 h-4 w-4 rounded-full border-2 border-white bg-primary-500" />
    {children}
  </div>
);

// Timeline.Header
// ---------------
export interface TimelineHeaderProps {
  children?: ReactNode;
}

const TimelineHeader = ({ children }: TimelineHeaderProps) => (
  <div className="text-sm font-medium leading-none">{children}</div>
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
  return (
    <div className="relative ml-4 flex flex-col gap-10 border-l-2 border-primary-300 pl-4">
      {children}
    </div>
  );
};

Timeline.Item = TimelineItem;
Timeline.Header = TimelineHeader;
Timeline.Body = TimelineBody;
