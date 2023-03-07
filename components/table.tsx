import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from 'lib/utils';

// Styles
// ---------------
const styles = {
  cell: cva(
    [
      'border-t border-secondary-100 font-light text-sm p-2 flex flex-row items-center',
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
  children?: React.ReactNode;
}

export const TableHeader = ({ children }: TableHeaderProps) => (
  <div className="p-2 text-sm font-bold">{children}</div>
);

// Cell
// ---------------
export interface TableCellProps extends VariantProps<typeof styles.cell> {
  children?: React.ReactNode;
  className?: string;
}

export const TableCell = ({ variant, className, children }: TableCellProps) => (
  <div className={styles.cell({ variant, className })}>{children}</div>
);

// Table
// ---------------
export interface TableProps {
  children?: React.ReactNode;
  className?: string;
  cols: string[];
  headers: React.ReactNode[];
}

export const Table = ({ cols, headers, className, children }: TableProps) => {
  if (cols.length !== headers.length) {
    throw new Error(
      `[Table] Number of columns and headers must be equal, got ${cols.length} cols and ${headers.length} headers.`
    );
  }

  return (
    <div className={cn('grid', `md:grid-cols-[${cols.join('_')}]`, className)}>
      {headers.map((header, idx) => (
        <TableHeader key={idx}>{header}</TableHeader>
      ))}
      {children}
    </div>
  );
};

Table.Cell = TableCell;
