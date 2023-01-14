'use client';

import { SearchField, Select } from 'components';
import { getAllFactions } from 'lib/data';
import { FactionOptions, useFilter } from './filter-context';

export const Filter = () => {
  const filter = useFilter();
  return (
    <div className="flex items-center justify-end gap-4 pb-8">
      <SearchField
        aria-label="Search"
        placeholder="Search..."
        value={filter.search}
        onChange={e => filter.setSearch(e.target.value)}
      />
      <Select
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
