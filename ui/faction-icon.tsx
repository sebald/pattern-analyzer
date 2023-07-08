import Image, { type ImageProps } from 'next/image';

import { getFactionName } from '@/lib/get-value';
import { XWSFaction } from '@/lib/types';

// Props
// ---------------
export interface FactionIconProps extends Omit<ImageProps, 'alt' | 'src'> {
  faction: XWSFaction;
}

// Component
// ---------------
export const FactionIcon = ({ faction, ...props }: FactionIconProps) => {
  const title = getFactionName(faction);
  return (
    <Image
      height={16}
      width={16}
      {...props}
      alt={title}
      title={title}
      src={`/icons/${faction}.svg`}
    />
  );
};
