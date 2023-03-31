'use client';
import useClipboard from 'react-use-clipboard';
import { Button, ButtonProps } from './button';

// Props
// ---------------
export interface CopyButtonProps extends Omit<ButtonProps, 'onClick'> {
  content: string;
}

// Component
// ---------------
export const CopyButton = ({
  content,
  children,
  ...props
}: CopyButtonProps) => {
  const [isCopied, setCopied] = useClipboard(content, {
    successDuration: 2000,
  });

  return (
    <Button {...props} onClick={setCopied}>
      {isCopied ? 'Copied to Clipboard' : children}
    </Button>
  );
};
