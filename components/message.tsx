import { cva, VariantProps } from 'class-variance-authority';
import { Failure, Info } from './icons';
import { Link, LinksProps } from './link';

// Message.Title
// ---------------
export interface MessageTitleProps {
  children?: React.ReactNode;
}

const MessageTitle = ({ children }: MessageTitleProps) => (
  <div className="font-semibold leading-6">{children}</div>
);

// Message.Body
// ---------------
export interface MessageBodyProps {
  children?: React.ReactNode;
}

const MessageBody = ({ children }: MessageBodyProps) => (
  <div className="">{children}</div>
);

// Message.Button
// ---------------
export interface MessageButtonProps
  extends React.ComponentPropsWithoutRef<'button'> {
  children?: React.ReactNode;
}

const MessageButton = ({
  children,
  type = 'button',
  ...props
}: MessageButtonProps) => (
  <button
    {...props}
    type={type}
    className="inline-block font-bold leading-loose"
  >
    {children}
  </button>
);

// Message.Link
// ---------------
export interface MessageLinkProps extends LinksProps {
  children?: React.ReactNode;
}

const MessageLink = ({ children, ...props }: MessageLinkProps) => (
  <Link {...props} className="inline-block font-bold leading-loose">
    {children}
  </Link>
);

// Message.Footer
// ---------------
export interface MessageFooterProps {
  children?: React.ReactNode;
}

const MessageFooter = ({ children }: MessageFooterProps) => (
  <div className="mt-2 flex space-x-4">{children}</div>
);

// Styles
// ---------------
const styles = cva(['flex gap-1 rounded-md p-4'], {
  variants: {
    variant: {
      info: 'bg-primary-200 text-primary-600',
      error: 'bg-red-200 text-red-500',
    },
    size: {
      regular: 'text-sm',
      large: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'info',
    size: 'regular',
  },
});

// Icons
// ---------------
const ICON_MAP = {
  info: Info,
  error: Failure,
  none: () => null,
};

// Props
// ---------------
export interface MessageProps extends VariantProps<typeof styles> {
  icon?: 'info' | 'error' | 'none';
  children?: React.ReactNode;
}

// Component
// ---------------
export const Message = ({
  variant = 'info',
  size,
  icon,
  children,
}: MessageProps) => {
  const Icon = ICON_MAP[icon || variant!];
  return (
    <div className={styles({ variant, size })}>
      {<Icon className="h-6 w-6 flex-shrink-0" />}
      <div>{children}</div>
    </div>
  );
};

Message.Title = MessageTitle;
Message.Body = MessageBody;
Message.Button = MessageButton;
Message.Link = MessageLink;
Message.Footer = MessageFooter;
