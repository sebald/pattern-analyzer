'use client';

import { useDebouncedCallback } from 'use-debounce';

import { FactionSelection, SearchField } from '@/ui';
import { useFilter } from './context';
import { ToggleGroup } from '@/ui/toggle-group';

export const Filter = () => {
  const filter = useFilter();
  const debounce = useDebouncedCallback(filter.setQuery, 150);

  return (
    <div className="flex flex-row items-end justify-end gap-2 pb-8 sm:gap-4">
      <SearchField
        size="small"
        className="lg:w-64"
        aria-label="Search"
        placeholder="Search..."
        defaultValue={filter.query}
        onChange={e => debounce(e.target.value)}
      />
      <FactionSelection
        value={filter.faction}
        onChange={filter.setFaction}
        allowAll
      />
      <ToggleGroup type="single" size="small">
        <ToggleGroup.Item value="rankings" aria-label="Toggle rankings">
          Rankings
        </ToggleGroup.Item>
        <ToggleGroup.Item value="lists" aria-label="Toggle lists">
          Squads
        </ToggleGroup.Item>
      </ToggleGroup>
    </div>
  );
};
