import type { ComponentProps } from 'react';
import Image from 'next/image';

import { getPilotName } from '@/lib/get-value';

export interface PilotImageProps
  extends Omit<ComponentProps<typeof Image>, 'src' | 'alt'> {
  pilot: string;
  alt?: string;
}

export const PilotImage = ({ pilot, alt, ...props }: PilotImageProps) => (
  <Image
    {...props}
    src={`https://infinitearenas.com/xw2/images/pilots/${pilot}.png`}
    alt={alt || getPilotName(pilot) || ''}
  />
);
