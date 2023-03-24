import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

import { flattenChildren } from './utils/flatten-children';

// Styles
// ---------------
const styles = {
  cell: cva(
    [
      'border-t border-secondary-100 font-light text-xs px-4 flex flex-row items-center',
    ],
    {
      variants: {
        variant: {
          default: 'text-secondary-600',
          number: 'tabular-nums text-secondary-600',
          header: 'text-secondary-800',
        },
        size: {
          collapsed: 'py-2',
          relaxed: 'py-3',
        },
      },
      defaultVariants: {
        variant: 'default',
        size: 'collapsed',
      },
    }
  ),
};

// Header
// ---------------
export interface TableHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export const TableHeader = ({ className, children }: TableHeaderProps) => (
  <div
    className={cn(
      'whitespace-nowrap px-4 pb-2 text-sm font-bold text-primary-800',
      className
    )}
  >
    {children}
  </div>
);

// Cell
// ---------------
export interface TableCellProps extends VariantProps<typeof styles.cell> {
  className?: string;
  children?: React.ReactNode;
}

export const TableCell = ({
  variant,
  size,
  className,
  children,
}: TableCellProps) => (
  <div className={styles.cell({ variant, size, className })}>{children}</div>
);

// Table
// ---------------
export interface TableProps {
  cols: string[];
  headers: React.ReactNode[];
  className?: string;
  size?: VariantProps<typeof styles.cell>['size'];
  children?: React.ReactNode;
}

export const Table = ({
  cols,
  headers,
  className,
  size,
  children,
}: TableProps) => {
  if (cols.length !== headers.length) {
    throw new Error(
      `[Table] Number of columns and headers must be equal, got ${cols.length} cols and ${headers.length} headers.`
    );
  }

  const count = cols.length;
  const isFirst = (idx: number) => idx % count === 0;
  const isLast = (idx: number) => (idx + 1) % count === 0;

  // Add additional classes to first/last col
  const addColClasses = (idx: number, otherClassName?: string) =>
    cn(
      otherClassName,
      isFirst(idx) && 'pl-2 bg-white sticky left-0',
      isLast(idx) && 'pr-2'
    );

  // Use CSS var to apply col layout
  const styles = { '--table-cols': cols.join(' ') } as React.CSSProperties;

  return (
    <div
      style={styles}
      className={cn(
        'grid grid-cols-[var(--table-cols)] overflow-x-auto',
        className
      )}
    >
      {headers.map((header, idx) => (
        <TableHeader key={idx} className={addColClasses(idx)}>
          {header}
        </TableHeader>
      ))}
      {flattenChildren(children).map((child, idx) => {
        if (
          !React.isValidElement<{ className?: string; size?: string | null }>(
            child
          )
        ) {
          return child;
        }

        return React.cloneElement(child, {
          ...child.props,
          className: addColClasses(idx, child.props.className),
          size,
        });
      })}
    </div>
  );
};

Table.Cell = TableCell;
