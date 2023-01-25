'use client';

import { useDebouncedCallback } from 'use-debounce';

import { FactionSelection, SearchField } from 'components';
import { useFilter } from './filter-context';

export const Filter = () => {
  const filter = useFilter();
  const debounce = useDebouncedCallback(filter.setQuery, 150);

  return (
    <div className="flex flex-row items-end justify-end gap-2 pb-8 sm:gap-4">
      <SearchField
        size="small"
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
    </div>
  );
};
