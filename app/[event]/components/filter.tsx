'use client';

import { useDebouncedCallback } from 'use-debounce';

import { SearchField, Select } from 'components';
import { getAllFactions } from 'lib/get-value';

import { FactionOptions, useFilter } from './filter-context';

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
      <Select
        size="small"
        aria-label="Faction"
        value={filter.faction}
        onChange={e => filter.setFaction(e.target.value as FactionOptions)}
      >
        <Select.Option value="all">All Factions</Select.Option>
        {getAllFactions().map(({ id, name }) => (
          <Select.Option key={id} value={id}>
            {name}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};
