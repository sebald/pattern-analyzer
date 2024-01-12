import { Children, cloneElement, forwardRef, isValidElement } from 'react';
import type { ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils/classname.utils';

// Styles
// ---------------
const styles = {
  row: cva([
    'grid-cols-subgrid col-span-full grid gap-5 px-4',
    'border-t border-secondary-100 first:border-none',
  ]),
  header: cva('whitespace-nowrap py-4 text-sm font-bold text-primary-800', {
    variants: {
      variant: {
        number: 'text-right',
      },
    },
  }),
  cell: cva(
    ['font-light text-xs flex flex-row items-center lg:text-sm lg:font-normal'],
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

// Row
// ---------------
interface RowProps {
  numeration?: ReactNode;
  cellProps?: CellProps[];
  className?: string;
  children?: ReactNode;
}

const Row = ({ numeration, cellProps = [], className, children }: RowProps) => (
  <div className={cn(styles.row(), className)}>
    {numeration ? (
      <Cell key="numeration" className="hidden md:flex">
        {numeration}
      </Cell>
    ) : null}
    {Children.map(children, (child, idx) => {
      const row = !isValidElement<CellProps>(child)
        ? child
        : cloneElement(child, {
            ...cellProps[idx],
            ...child.props,
          });

      return row;
    })}
  </div>
);

// Header
// ---------------
export interface HeaderProps extends VariantProps<typeof styles.header> {
  className?: string;
  children?: React.ReactNode;
}

export const Header = ({ variant, className, children }: HeaderProps) => (
  <div className={cn(styles.header({ variant }), className)}>{children}</div>
);

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

// Table
// ---------------
export interface TableColumnProps {
  width?: string;
  variant?: 'number';
  children?: ReactNode;
}

export interface TableProps {
  columns: TableColumnProps[];
  numeration?: boolean;
  size?: VariantProps<typeof styles.cell>['size'];
  className?: string;
  children?: ReactNode;
}

export const Table = forwardRef<HTMLDivElement, TableProps>(
  ({ columns, numeration, size, className, children }, ref) => {
    const columnWidths = columns.map(({ width }) => width).join(' ');
    const styles = {
      '--table-cols': columnWidths,
      '--md-table-cols': numeration
        ? `minmax(auto, max-content) ${columnWidths}`
        : undefined,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        style={styles}
        className={cn(
          'grid grid-cols-[--table-cols] overflow-x-auto',
          numeration && 'md:grid-cols-[--md-table-cols]',
          className
        )}
      >
        <Row>
          <Header>#</Header>
          {columns.map(({ children, variant }, idx) => (
            <Header key={idx} variant={variant}>
              {children}
            </Header>
          ))}
        </Row>
        {Children.map(children, (child, idx) => {
          const row = !isValidElement<RowProps>(child)
            ? child
            : cloneElement(child, {
                numeration: numeration ? idx + 1 : undefined,
                cellProps: columns.map(({ variant }) => ({
                  variant,
                  size,
                })),
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
