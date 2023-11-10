import { Skeleton, HeadlineSkeleton, CardChartSkeleton } from '@/ui';

export const Loading = () => (
  <Skeleton>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <CardChartSkeleton />
      <CardChartSkeleton />
      <div className="col-span-full">
        <CardChartSkeleton />
      </div>
    </div>
  </Skeleton>
);

export default Loading;
