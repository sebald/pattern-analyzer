export const createSubset = (squad: string[], omit: number) => {
  // No need to create a subset if no ship should be omitted.
  if (omit < 1) {
    return squad;
  }
};
