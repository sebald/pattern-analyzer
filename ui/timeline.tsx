import { ReactNode } from 'react';

// Timeline.Item
// ---------------
export interface TimelineItemProps {
  children?: ReactNode;
}

const TimelineItem = ({ children }: TimelineItemProps) => (
  <div className="flex flex-col gap-x-10 gap-y-6 md:flex-row">{children}</div>
);

// Timeline.Header
// ---------------
export interface TimelineHeaderProps {
  children?: ReactNode;
}

const TimelineHeader = ({ children }: TimelineHeaderProps) => (
  <div className="mt-1.5 text-sm font-medium leading-none md:mt-0 md:w-28 md:text-base">
    <div className="absolute left-[-9px] mt-1 h-4 w-4 rounded-full border-2 border-white bg-primary-500" />
    {children}
  </div>
);

// Timeline.Caption
// ---------------
export interface TimelineCaptionProps {
  children?: ReactNode;
}

const TimelineCaption = ({ children }: TimelineCaptionProps) => (
  <div className="text-xs font-normal text-secondary-400 md:text-sm">
    {children}
  </div>
);

// Timeline.Body
// ---------------
export interface TimelineBodyProps {
  className?: string;
  children?: ReactNode;
}

const TimelineBody = ({ className, children }: TimelineBodyProps) => (
  <div className={className}>{children}</div>
);

// Props
// ---------------
export interface TimelineProps {
  children?: ReactNode;
}

// Component
// ---------------
export const Timeline = ({ children }: TimelineProps) => {
  return (
    <div className="relative ml-4 flex flex-col gap-14 border-l-2 border-primary-300 py-2 pl-4">
      {children}
    </div>
  );
};

Timeline.Item = TimelineItem;
Timeline.Header = TimelineHeader;
Timeline.Caption = TimelineCaption;
Timeline.Body = TimelineBody;
