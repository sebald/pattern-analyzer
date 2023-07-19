import type { ReactNode } from 'react';

// Props
// ---------------
export interface DetailProps {
  label: ReactNode;
  value: ReactNode;
}

// Component
// ---------------
export const Detail = ({ label, value }: DetailProps) => (
  <div>
    <div className="text-sm font-medium leading-none text-primary-500">
      {label}
    </div>
    <div className="text-2xl font-medium text-secondary-700">{value}</div>
  </div>
);
