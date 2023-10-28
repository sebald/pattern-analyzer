import qs from 'query-string';

/**
 * Used to parse a dynamic route segment and use it as query params.
 *
 * This is done because using `searchParams` (the real query params) will cause
 * pages to switch to dynamic mode.
 */
export const pq = (query: string = '') => qs.parse(decodeURIComponent(query));
