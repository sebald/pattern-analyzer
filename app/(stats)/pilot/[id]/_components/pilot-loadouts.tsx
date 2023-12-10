import { XWSUpgrades } from '@/lib/types';

export interface PilotLoadoutProps {
  value: {
    id: string;
    list: XWSUpgrades;
    count: number;
    percentile: number;
  }[];
}

export const PilotLoadouts = ({ value }: PilotLoadoutProps) => {
  /**
   * same as with the squads: filter out low frequency loadouts
   * dont show loadout of SL?
   * sort by percentile / count / ... ?
   */

  return (
    <pre>
      <code>{JSON.stringify(value, null, 2)}</code>
    </pre>
  );
};
