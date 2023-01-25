export const FooterHint = () => (
  <div className="px-1 pt-1 text-xs text-secondary-300">
    *This data does not include unknown squads. Only squads that could be parsed
    are included.
  </div>
);

export const toPercentage = (value: number) =>
  new Intl.NumberFormat('default', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const calcWeightedAverage = (
  map: { [key: number]: number },
  total: number
) =>
  Object.entries(map).reduce((mean, [size, count]) => {
    mean = mean + Number(size) * count;
    return mean;
  }, 0) / total;
