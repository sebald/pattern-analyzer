import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from 'lib/utils';

import { flattenChildren } from './utils/flatten-children';

// Styles
// ---------------
const styles = {
  cell: cva(
    [
      'border-t border-secondary-100 font-light text-xs py-2 px-4 flex flex-row items-center',
    ],
    {
      variants: {
        variant: {
          default: 'text-secondary-400',
          number: 'tabular-nums text-secondary-400',
          header: 'text-secondary-800',
        },
      },
      defaultVariants: {
        variant: 'default',
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
    className={cn('whitespace-nowrap px-4 pb-2 text-sm font-bold', className)}
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

export const TableCell = ({ variant, className, children }: TableCellProps) => (
  <div className={styles.cell({ variant, className })}>{children}</div>
);

// Table
// ---------------
export interface TableProps {
  cols: string[];
  headers: React.ReactNode[];
  className?: string;
  children?: React.ReactNode;
}

export const Table = ({ cols, headers, className, children }: TableProps) => {
  if (cols.length !== headers.length) {
    throw new Error(
      `[Table] Number of columns and headers must be equal, got ${cols.length} cols and ${headers.length} headers.`
    );
  }

  const count = cols.length;
  const isFirst = (idx: number) => idx % count === 0;
  const isLast = (idx: number) => (idx + 1) / count === 0;

  const styles = { '--table-cols': cols.join(' ') } as React.CSSProperties;

  return (
    <div className="overflow-x-auto">
      <div
        style={styles}
        className={cn(
          'grid grid-cols-[var(--table-cols)]',
          // `[&>*:nth-child(${headers.length}n+1)]:sticky`,
          // `[&>*:nth-child(${headers.length}n+1)]:pl-2`,
          // `[&>*:nth-child(${headers.length}n)]:pr-2`,
          className
        )}
      >
        {headers.map((header, idx) => (
          <TableHeader
            key={idx}
            className={
              idx === 0 ? 'pl-2' : idx + 1 === headers.length ? 'pr-2' : ''
            }
          >
            {header}
          </TableHeader>
        ))}
        {flattenChildren(children).map((child, idx) => {
          if (!React.isValidElement<{ className?: string }>(child)) {
            return child;
          }

          console.log(idx, isLast(idx));
          /**
           * Add different padding to cells that are first/last in a
           * row.
           */
          return React.cloneElement(child, {
            ...child.props,
            className: cn(
              child.props.className,
              isFirst(idx) && 'pl-2',
              isLast(idx) && 'pr-2'
            ),
          });
        })}
      </div>
    </div>
  );
};

Table.Cell = TableCell;
