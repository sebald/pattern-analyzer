'use client';

import { XWSUpgradeSlots } from '@/lib/types';
import { UpgradeSlotSelection } from '@/ui/upgrade-slot-selection';

import { useParams } from './useParams';

// Hook
// ---------------
export const useSlotFilter = () => {
  const [filter, setFilter] = useParams(['slot']);

  const setSlot = (slot: XWSUpgradeSlots | 'all') => {
    setFilter({
      slot: slot !== 'all' ? slot : null,
    });
  };

  const slot = (filter.slot || 'all') as XWSUpgradeSlots | 'all';

  return [slot, setSlot] as const;
};

// Component
// ---------------
export const SlotFilter = () => {
  const [slot, setSlot] = useSlotFilter();
  return <UpgradeSlotSelection value={slot} onChange={setSlot} allowAll />;
};
