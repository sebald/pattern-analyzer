import { cloneElement, forwardRef, isValidElement } from 'react';
import type { ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn, flattenChildren } from '@/lib/utils';

// Styles
// ---------------
const styles = {
  header: cva('whitespace-nowrap p-4 text-sm font-bold text-primary-800', {
    variants: {
      variant: {
        number: 'text-right',
      },
    },
  }),
  cell: cva(
    [
      'border-t border-secondary-100 font-light text-xs px-4 flex flex-row items-center lg:text-sm lg:font-normal',
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

// Header
// ---------------
export interface TableHeaderProps extends VariantProps<typeof styles.header> {
  className?: string;
  children?: React.ReactNode;
}

export const TableHeader = ({
  variant,
  className,
  children,
}: TableHeaderProps) => (
  <div className={cn(styles.header({ variant }), className)}>{children}</div>
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
  <div className={cn(styles.cell({ variant, size }), className)}>
    {children}
  </div>
);

// Table
// ---------------
export interface TableColumnProps {
  children?: ReactNode;
  width?: string;
  variant?: 'number';
}

export interface TableProps {
  columns: TableColumnProps[];
  numeration?: boolean;
  className?: string;
  size?: VariantProps<typeof styles.cell>['size'];
  children?: React.ReactNode;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ columns, numeration, className, size, children }, ref) => {
    const widths = columns.map(({ width }) => width).join(' ');
    const count = columns.length;
    const isFirst = (idx: number) => idx % count === 0;

    // Add additional classes to first/last col
    const addColClasses = (idx: number, otherClassName?: string) =>
      cn(otherClassName, isFirst(idx) && 'bg-white sticky left-0');

    const styles = {
      '--table-cols': widths,
      '--md-table-cols': numeration
        ? `minmax(auto, max-content) ${widths}`
        : undefined,
    } as React.CSSProperties;

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
        {numeration ? (
          <TableHeader key="idx-header" className="hidden md:flex">
            #
          </TableHeader>
        ) : null}
        {columns.map(({ children, variant }, idx) => (
          <TableHeader
            key={idx}
            variant={variant}
            className={addColClasses(idx)}
          >
            {children}
          </TableHeader>
        ))}

        {flattenChildren(children).map((child, idx) => {
          // Make TS happy.
          const cell = !isValidElement<{
            className?: string;
            variant?: string;
            size?: string | null;
          }>(child)
            ? child
            : cloneElement(child, {
                ...child.props,
                variant: child.props.variant || columns[idx % count]?.variant,
                className: addColClasses(idx, child.props.className),
                size,
              });

          return numeration && isFirst(idx) ? (
            <>
              <TableCell
                key={`idx.${idx / count + 1}`}
                className="hidden text-secondary-300 md:flex"
              >
                {idx / count + 1}
              </TableCell>
              {cell}
            </>
          ) : (
            cell
          );
        })}
      </div>
    );
  }
) as Table;

Table.displayName = 'Table';
Table.Cell = TableCell;

export interface Table
  extends React.ForwardRefExoticComponent<
    TableProps & React.RefAttributes<HTMLTableElement>
  > {
  Cell: typeof TableCell;
}
