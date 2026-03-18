'use client';

import { useState, useCallback } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
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
  const [isCopied, setIsCopied] = useState(false);
  const [, copy] = useCopyToClipboard();

  const handleCopy = useCallback(() => {
    copy(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [content, copy]);

  return (
    <Button {...props} onClick={handleCopy}>
      {isCopied ? 'Copied to Clipboard' : children}
    </Button>
  );
};
