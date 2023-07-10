import { Skeleton, HeadlineSkeleton, CardChartSkeleton } from '@/ui';

export const Loading = () => (
  <Skeleton>
    <HeadlineSkeleton className="mt-8 h-14 w-72" />
    <HeadlineSkeleton className="mt-2 h-4 w-44" />
    <div className="mb-4 mt-8 flex flex-col items-end">
      <HeadlineSkeleton className="h-8 w-44" />
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <CardChartSkeleton />
      <CardChartSkeleton />
      <CardChartSkeleton />
      <CardChartSkeleton />
    </div>
  </Skeleton>
);

export default Loading;
