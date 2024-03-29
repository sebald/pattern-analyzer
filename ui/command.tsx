'use client';

import { forwardRef } from 'react';
import type {
  ElementRef,
  ComponentPropsWithoutRef,
  HTMLAttributes,
} from 'react';
import { Command as CommandPrimitive } from 'cmdk';

import { Dialog } from '@/ui/dialog';
import type { DialogProps } from '@/ui/dialog';
import { MagnifyingGlass } from '@/ui/icons';
import { cn } from '@/lib/utils';

// Command
// ---------------
export const Command = forwardRef<
  ElementRef<typeof CommandPrimitive>,
  ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'flex h-full w-full flex-col overflow-hidden rounded-md bg-white text-secondary-800',
      className
    )}
    {...props}
  />
)) as Command;
Command.displayName = CommandPrimitive.displayName;

// Command.Dialog
// ---------------
interface CommandDialogProps
  extends DialogProps,
    ComponentPropsWithoutRef<typeof CommandPrimitive> {}

const CommandDialog = ({
  children,
  open,
  onOpenChange,
  ...props
}: CommandDialogProps) => {
  return (
    <Dialog {...props} open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="overflow-hidden p-0">
        <Command
          {...props}
          className={cn(
            '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-secondary-400',
            '[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2',
            '[&_[cmdk-input-wrapper]_svg]:size-4',
            '[&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3',
            '[&_[cmdk-item]_svg]:size-4 [&_[cmdk-item]_svg]:opacity-50'
          )}
        >
          {children}
        </Command>
      </Dialog.Content>
    </Dialog>
  );
};

// Command.Input
// ---------------
const CommandInput = forwardRef<
  ElementRef<typeof CommandPrimitive.Input>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <MagnifyingGlass className="mr-2 size-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'flex h-10 w-full py-3',
        'placeholder:text-secondary-500',
        'border-0 border-transparent bg-transparent text-sm outline-none focus:ring-0',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

// Command.List
// ---------------
const CommandList = forwardRef<
  ElementRef<typeof CommandPrimitive.List>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

// Command.Empty
// ---------------
const CommandEmpty = forwardRef<
  ElementRef<typeof CommandPrimitive.Empty>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

// Command.Group
// ---------------
const CommandGroup = forwardRef<
  ElementRef<typeof CommandPrimitive.Group>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'overflow-hidden p-1 text-secondary-700',
      // Child heading
      '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5',
      '[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-primary-600',
      className
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

// Command.Separator
// ---------------
const CommandSeparator = forwardRef<
  ElementRef<typeof CommandPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 h-px bg-secondary-900', className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

// Command.Item
// ---------------
const CommandItem = forwardRef<
  ElementRef<typeof CommandPrimitive.Item>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center gap-1.5 rounded px-2 py-1.5',
      'text-sm font-medium outline-none aria-selected:bg-primary-100/70 aria-selected:text-primary-900',
      'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
      className
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

// Command.Shortcut
// ---------------
const CommandShortcut = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-secondary-400',
        className
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = 'CommandShortcut';

// Exports
// ---------------
Command.Dialog = CommandDialog;
Command.Input = CommandInput;
Command.List = CommandList;
Command.Empty = CommandEmpty;
Command.Group = CommandGroup;
Command.Item = CommandItem;
Command.Shortcut = CommandShortcut;
Command.Separator = CommandSeparator;

export interface Command
  extends React.ForwardRefExoticComponent<
    ComponentPropsWithoutRef<typeof CommandPrimitive> &
      React.RefAttributes<HTMLDivElement>
  > {
  Dialog: typeof CommandDialog;
  Input: typeof CommandInput;
  List: typeof CommandList;
  Empty: typeof CommandEmpty;
  Group: typeof CommandGroup;
  Item: typeof CommandItem;
  Shortcut: typeof CommandShortcut;
  Separator: typeof CommandSeparator;
}
