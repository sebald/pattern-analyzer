/**
 * Fetchter for usage with `swr`.
 */
export const getJson = async <T = any>(url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      'An error occurred while fetching the data.'
    ) as any;
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json() as T;
};
