import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
} from 'react';
import type { ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils/classname.utils';

// Styles
// ---------------
const styles = {
  row: cva(['grid-cols-subgrid col-span-full grid','border-t border-secondary-100 first:border-none']),
  header: cva('whitespace-nowrap p-4 text-sm font-bold text-primary-800', {
    variants: {
      align: {
        left: '',
        right: 'text-right',
      },
    },
  }),
  cell: cva(
    [
      'font-light text-xs px-4 flex flex-row items-center lg:text-sm lg:font-normal',
    ],
    {
      variants: {
        variant: {
          default: 'text-secondary-600',
          number: 'tabular-nums text-secondary-600 justify-end',
          header: 'text-secondary-800',
        },
        size: {
          collapsed: 'py-2.5 md:py-3.5 min-h-[44px] md:min-h-[50px]',
          relaxed: 'py-3.5',
        },
      },
      defaultVariants: {
        variant: 'default',
        size: 'collapsed',
      },
    }
  ),
};

// Cell
// ---------------
export interface CellProps extends VariantProps<typeof styles.cell> {
  className?: string;
  children?: React.ReactNode;
}

export const Cell = ({ variant, size, className, children }: CellProps) => (
  <div className={cn(styles.cell({ variant, size }), className)}>
    {children}
  </div>
);

// Row
// ---------------
interface RowProps {
  numeration?: ReactNode;
  className?: string;
  children?: ReactNode;
}

const Row = ({ numeration, className, children }: RowProps) => (
  <div className={cn(styles.row(), className)}>
    {numeration ? (
      <Cell key="numeration" className="hidden md:flex">
        {numeration}
      </Cell>
    ) : null}
    {children}
  </div>
);

// Table
// ---------------
export interface TableColumnProps {
  width?: string;
  align?: 'left' | 'center' | 'right';
  children?: ReactNode;
}

export interface TableProps {
  columns: TableColumnProps[];
  numeration?: boolean;
  className?: string;
  children?: ReactNode;
}

export const Table = forwardRef<HTMLDivElement, TableProps>(
  ({ columns, numeration, className, children }, ref) => {
    const columnWidths = columns.map(({ width }) => width).join(' ');
    const styles = {
      '--table-cols': columnWidths,
      '--md-table-cols': numeration
        ? `minmax(auto, max-content) ${columnWidths}`
        : undefined,
    } as React.CSSProperties;

    /**
     * align via n-th child on row or table?
     *
     * numeration: move it out of the component? maybe we can just hide
     * the numeration cell without changing the cols var?
     *
     * clone row
     * make a class with var --child-<number>-align
     */

    return (
      <div
        ref={ref}
        style={styles}
        className={cn(
          'grid grid-cols-[var(--table-cols)] overflow-x-auto',
          numeration && 'md:grid-cols-[var(--md-table-cols)]',
          className
        )}
      >
        <Row>
          <Cell>#</Cell>
          {columns.map(({ children }, idx) => (
            <Cell key={idx}>{children}</Cell>
          ))}
        </Row>
        {Children.map(children, (child, idx) => {
          const row = !isValidElement<{
            className?: string;
            variant?: string;
            size?: string | null;
            numeration?: ReactNode;
          }>(child)
            ? child
            : cloneElement(child, {
              numeration: numeration ? idx+1 : undefined,
                ...child.props,
              });

          return row;
        })}
      </div>
    );
  }
) as Table;

Table.displayName = 'Table';
Table.Cell = Cell;
Table.Row = Row;

export interface Table
  extends React.ForwardRefExoticComponent<
    TableProps & React.RefAttributes<HTMLTableElement>
  > {
  Cell: typeof Cell;
  Row: typeof Row;
}
