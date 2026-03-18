import { XWSUpgradeSlots } from '@/lib/types';
import { Select } from './select';

const SLOTS: { id: XWSUpgradeSlots; name: string }[] = [
  { id: 'astromech', name: 'Astromech' },
  { id: 'cannon', name: 'Cannon' },
  { id: 'configuration', name: 'Configuration' },
  { id: 'crew', name: 'Crew' },
  { id: 'device', name: 'Device' },
  { id: 'force-power', name: 'Force' },
  { id: 'gunner', name: 'Gunner' },
  { id: 'illicit', name: 'Illicit' },
  { id: 'missile', name: 'Missile' },
  { id: 'modification', name: 'Modification' },
  { id: 'sensor', name: 'Sensor' },
  { id: 'tactical-relay', name: 'Relay' },
  { id: 'talent', name: 'Talent' },
  { id: 'tech', name: 'Tech' },
  { id: 'title', name: 'Title' },
  { id: 'torpedo', name: 'Torpedo' },
  { id: 'turret', name: 'Turret' },
];

export type UpgradeSlotSelectionProps =
  | {
      value: XWSUpgradeSlots;
      onChange: (slot: XWSUpgradeSlots) => void;
      allowAll?: never | false;
    }
  | {
      value: 'all' | XWSUpgradeSlots;
      onChange: (slot: 'all' | XWSUpgradeSlots) => void;
      allowAll: true;
    };

export const UpgradeSlotSelection = ({
  value,
  onChange,
  allowAll,
}: UpgradeSlotSelectionProps) => (
  <Select
    size="small"
    aria-label="Select an upgrade"
    value={value}
    onChange={e => onChange(e.target.value as any)}
  >
    {allowAll && <Select.Option value="all">All Upgrade Slots</Select.Option>}
    {SLOTS.map(({ id, name }) => (
      <Select.Option key={id} value={id}>
        {name}
      </Select.Option>
    ))}
  </Select>
);
