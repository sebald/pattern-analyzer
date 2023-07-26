import type { ComponentProps } from 'react';
import Image from 'next/image';

import { getPilotName } from '@/lib/get-value';

export interface PilotImageProps
  extends Omit<ComponentProps<typeof Image>, 'src' | 'alt'> {
  pilot: string;
  type?: 'card' | 'art';
  alt?: string;
}

export const PilotImage = ({
  pilot,
  type = 'card',
  alt,
  ...props
}: PilotImageProps) => (
  <Image
    {...props}
    src={`https://infinitearenas.com/xw2/images/${
      type === 'art' ? 'artwork/' : ''
    }/pilots/${pilot}.png`}
    alt={alt || getPilotName(pilot) || ''}
  />
);
