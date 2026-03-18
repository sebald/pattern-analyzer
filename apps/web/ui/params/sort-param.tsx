'use client';

import { SortOptions, SortSelection } from '@/ui/sort-selection';
import { useParams } from './useParams';

// Hook
// ---------------
export const useSortParam = () => {
  const [filter, setFilter] = useParams(['sort']);

  const setSort = (sortBy: SortOptions) => {
    setFilter({
      sort: sortBy !== 'percentile' ? sortBy : null,
    });
  };

  return [filter.sort || 'percentile', setSort] as [
    SortOptions,
    (sortBy: SortOptions) => void,
  ];
};

// Components
// ---------------
export const SortParam = () => {
  const [sort, setSort] = useSortParam();
  return <SortSelection value={sort} onChange={setSort} />;
};
